import requests
from datapackage import Package
import json
import urllib.request, json
from shapely.geometry import shape


mat = {}
country_dict = {}

with open("country_shapes.json") as country_shapes:
    with open("species_shapes.json") as species_shapes:
        data = json.load(country_shapes)
        for shapes in data.keys():
            shp  = data[shapes]
            country_dict[shapes] = shape(shp)
        for line in species_shapes:
            if line.strip() != "":
                print(line)
                line = json.loads(line.strip())
                species_name = line["binomial"]
                species_shape = shape(line["geometry"])
                for country in country_dict.keys():
                    c = country_dict[country]
                    if c.intersects(species_shape):
                        a = c.intersection(species_shape)

                        if country in mat.keys():
                            mat[country].append((species_name, a.area / c.area))
                        else:
                            mat[country] = []
                            mat[country].append((species_name, a.area / c.area))

out_f = open("countries_corrected.json", "w")
print(json.dumps(mat), file=out_f)
out_f.close()
