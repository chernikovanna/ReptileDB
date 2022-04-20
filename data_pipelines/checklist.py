import requests
import json
import urllib.request
import sqlite3 as sl
from datapackage import Package
import logs
import aio
from shapely.geometry import shape



QUERY_SPECIES = "https://api.reptile-database.org/species?genus=%s&species=%s"
ALL_SPECIES_SEARCH = "https://api.reptile-database.org/search"

SQL_INSERT_SPECIESCOUNTRIES = 'INSERT INTO SPECIESCOUNTRIES (SpeciesName, CountriesName, Coverage) values(?, ?, ?)'
SQL_INSERT_SPECIES = 'INSERT INTO SPECIES (name, year, taxa) values(?, ?, ?)'
SQL_INSERT_COUNTRIES = 'INSERT INTO COUNTRIES (code, name) values(?, ?)'

def create_tables():
        con = sl.connect('reptile.db')
        log.print_message(" Creating Tables in reptile.db")
        with con:
            con.execute("""
                CREATE TABLE Countries (
                    code TEXT PRIMARY KEY,
                    name TEXT
                );
            """)
            con.execute("""
                CREATE TABLE Species (
                    name TEXT PRIMARY KEY,
                    year INTEGER,
                    taxa TEXT
                );
            """)
            con.execute("""
                CREATE TABLE SpeciesCountries
                (
                    SpeciesName TEXT NOT NULL,
                    CountriesName TEXT NOT NULL,
                    Coverage FLOAT NOT NULL,
                    CONSTRAINT PK_SpeciesCountries PRIMARY KEY
                    (
                        SpeciesName,
                        CountriesName
                    ),
                    FOREIGN KEY (SpeciesName) REFERENCES Species (name),
                    FOREIGN KEY (CountriesName) REFERENCES Countries (name)
                )
            """)

#Create Junction Table
def get_countries(specie, description):
    con = sl.connect('reptile.db')
    data = con.execute("SELECT * FROM COUNTRIES")
    global all_matches
    all_matches = []
    for d in data:
        if d[1] in description:
            datum = (specie, d[0], 1)
            all_matches.append(datum)
    with con:
        con.executemany(SQL_INSERT_SPECIESCOUNTRIES, all_matches)

def load_countries():
    #Create countries TABLE
    log.print_message(" Loading Countries ")
    with open("../data/countries.csv") as f :
        con = sl.connect('reptile.db')
        all_countries = []
        for line in f:
            line = line.strip().split(",")
            code = line[2]
            name = line[3].replace("\"","")
            data = (code, name)
            all_countries.append(data)
        with con:
            con.executemany(SQL_INSERT_COUNTRIES, all_countries)
        if con:
            con.close()
    log.print_message(" Loading Countries Completed. ")

#Create species tabe
def load_species():
    global url_list
    url_list = []
    log.print_message(" Loading Species ")
    with urllib.request.urlopen(ALL_SPECIES_SEARCH) as search:
        data = json.loads(search.read().decode())
        con = sl.connect('reptile.db')
        global all_species
        all_species = []
        for d in data:
            genus = d['genus']
            species = d['species']
            taxa = d['taxa']
            year = d['year']
            entry = (genus + " " + species, year, taxa)
            all_species.append(entry)
            url = QUERY_SPECIES % (genus,species)
            url_list.append(url)
        with con:
            con.executemany(SQL_INSERT_SPECIES, all_species)
        if con:
            con.close()
        log.print_message(" Loading Species Completed. ")
        log.print_message(" Requesting Entries ")
        a = aio.Aio(url_list)
        entry_list = a.run()
        log.print_message(" Requesting Entries Completed.")
        for i, key in enumerate(entry_list):
            entry = json.loads(entry_list[key])
            distribution = entry['distribution']
            idx = url_list.index(key)
            get_countries(all_species[idx][0], distribution)

def load_spatial():
    log.print_message(" Loading GeoJSON Countries ")


    shapefiles = json.loads(open('../static/world.geojson').read())

    country_dict = {}
    for shapes in shapefiles["features"]:
        shp  = shapes["geometry"]
        country_dict[shapes["id"]] = shape(shp)
    log.print_message(" Loading GeoJSON Countries Completed.")

    log.print_message(" Loading GeoJSON Species ")
    url_list_spatial = []
    for url in url_list:
        url_list_spatial.append(url.replace("species?","spatial?"))
    a = aio.Aio(url_list_spatial)
    spatial_list = a.run()
    log.print_message(" Loading GeoJSON Species Completed. ")

    print(len(spatial_list))
    for i, line in enumerate(url_list_spatial):
        if spatial_list[line] != "":
            line = json.loads(spatial_list[line])
            species_shape = shape(line["geometry"])
            for country in country_dict.keys():
                c = country_dict[country]
                if c.intersects(species_shape):
                    a = c.intersection(species_shape)
                    con = sl.connect('reptile.db')
                    with con:
                        if (all_species[i][0], country, 1) in all_matches:
                            sql = """UPDATE SpeciesCountries
                                    SET Coverage= %s
                                    WHERE SpeciesName = %s AND CountriesName = %s"""
                            con.execute(sql%(a.area,all_species[i][0],country))
                        else:
                            con.execute(SQL_INSERT_SPECIESCOUNTRIES, (all_species[i][0], country, a.area))


    log.print_message(" Loading GeoJSON Species Completed. ")

def main():
    global log
    log = logs.Log("reptile.db.log")
    create_tables()
    load_countries()
    load_species()
    load_spatial()

if __name__ == '__main__':
    main()
