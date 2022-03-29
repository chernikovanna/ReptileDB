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

out_f = open("country_shapes.json", "w")
print(json.dumps(country_dict), file=out_f)
out_f.close()
