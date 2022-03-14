import requests
from datapackage import Package
import json
import urllib.request, json
from shapely.geometry import shape

package = Package('https://datahub.io/core/geo-countries/datapackage.json')

# print list of all resources:
p = package.resources[2].descriptor['path']
shapefiles = json.loads(requests.get(p).text)

country_dict = {}
for shapes in shapefiles["features"]:
    shp  = shapes["geometry"]
    country_dict[shapes["properties"]["ADMIN"]] = shape(shp)


mat = {}

with urllib.request.urlopen("https://api.reptile-database.org/search") as url:
    data = json.loads(url.read().decode())
    i = 0
    l = len(data)
    for d in data:
        print(i, " of ", l)
        g = d['genus']
        s = d['species']
        u = "https://api.reptile-database.org/spatial?genus=" + g + "&species=" + s
        species_name = g + " " + s
        with urllib.request.urlopen(u) as url_inner:
            response = requests.get(u)
            if 'Content-Type' in response.headers.keys():
                entry = json.loads(url_inner.read().decode())
                species_shape = shape(entry["geometry"])
                for country in country_dict.keys():
                    c = country_dict[country]
                    if c.intersects(species_shape):
                        if country in mat.keys():
                            mat[country].append(species_name)
                        else:
                            mat[country] = []
                            mat[country].append(species_name)

out_f = open("countries_corrected.json", "w")
print(json.dumps(mat), file=out_f)
out_f.close()
