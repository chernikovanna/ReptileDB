import requests


COUNTRY_LIST = "../data/country_list"

#read country list
f = open(COUNTRY_LIST, "r")
countries = f.read().split("\n")
f.close()

#clean country list
for i in range(len(countries)):
    countries[i] = countries[i].split(",")[0]

#List
mat = {}

#species
sp = {}
import urllib.request, json
with urllib.request.urlopen("https://api.reptile-database.org/search") as url:
    data = json.loads(url.read().decode())
    for d in data:
        g = d['genus']
        s = d['species']
        sp[g + ' ' + s] = d
        u = "https://api.reptile-database.org/species?genus=" + g + "&species=" + s
        with urllib.request.urlopen(u) as url_inner:
            entry = json.loads(url_inner.read().decode())
            species_name = g + " " + s
            line = entry['distribution']
            for country in countries:
                if country in line:
                    if country in mat.keys():
                        mat[country].append(species_name)
                    else:
                        mat[country] = []
                        mat[country].append(species_name)

out_f = open("species.json", "w")
print(json.dumps(sp), file=out_f)
out_f.close()

out_f = open("countries.json", "w")
print(json.dumps(mat), file=out_f)
out_f.close()
