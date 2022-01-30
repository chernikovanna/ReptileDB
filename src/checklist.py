#File paths
FULL_DB_PATH = "../test/full_db/reptile_database_2021_11.txt"
COUNTRY_LIST = "../test/country_list"

#read country list
f = open(COUNTRY_LIST, "r")
countries = f.read().split("\n")
f.close()

#clean country list
for i in range(len(countries)):
    countries[i] = countries[i].split(",")[0]

#Sparse Matrix
mat = [None] * len(countries)

#read from reptile database
with open(FULL_DB_PATH, encoding="utf_16") as f:
    for line in f.readlines():
        s = line.split("\t")
        species_name = s[1] + " " + s[2]
        for country in countries:
            if country in line:
                if mat[countries.index(country)] is not None:
                    mat[countries.index(country)].append(species_name)
                else:
                    mat[countries.index(country)] = []
                    mat[countries.index(country)].append(species_name)

country_name = input("What country?:")
print(mat[countries.index(country_name)])
