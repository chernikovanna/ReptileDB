import requests
from datapackage import Package
import json
import urllib.request, json
from shapely.geometry import shape


species = {}
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
                species[species_name] = entry["geometry"]

out_f = open("species_shapes.json", "w")
print(json.dumps(species), file=out_f)
out_f.close()
