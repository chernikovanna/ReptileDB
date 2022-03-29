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

with open("species.json") as url:
    data = json.load(url)
    ugh = [d for d in enumerate(data)]
    ugh = ugh[0:1000]
    for i in range(len(ugh)):
        species_name = ugh[i][1]
        g = species_name.split(" ")[0]
        s = species_name.split(" ")[1]
        u = "https://api.reptile-database.org/spatial?genus=" + g + "&species=" + s
        with urllib.request.urlopen(u) as url_inner:
            response = requests.get(u)
            if 'Content-Type' in response.headers.keys():
                entry = json.loads(url_inner.read().decode())
                species_shape = shape(entry["geometry"])
                for country in country_dict.keys():
                    c = country_dict[country]
                    if c.intersects(species_shape):
                        a = c.intersection(species_shape)
                        if country in mat.keys():
                            mat[country].append((species_name, a.area))
                        else:
                            mat[country] = []
                            mat[country].append((species_name, a.area))

out_f = open("countries_corrected.json", "w")
print(json.dumps(mat), file=out_f)
out_f.close()
