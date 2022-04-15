import requests
import json
import urllib.request
import sqlite3 as sl
import logs
import aio

QUERY_SPECIES = "https://api.reptile-database.org/species?genus=%s&species=%s"
ALL_SPECIES = "https://api.reptile-database.org/search"

SQL_INSERT_SPECIESCOUNTRIES = 'INSERT INTO SPECIESCOUNTRIES (SpeciesName, CountriesName, Coverage) values(?, ?, ?)'
SQL_INSERT_SPECIES = 'INSERT INTO SPECIES (name, year, taxa) values(?, ?, ?)'
SQL_INSERT_COUNTRIES = 'INSERT INTO COUNTRIES (code, name) values(?, ?)'

def create_tables(log):
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
    all_matches = []
    for d in data:
        if d[1] in description:
            datum = (specie, d[0], 1)
            all_matches.append(datum)
    with con:
        con.executemany(SQL_INSERT_SPECIESCOUNTRIES, all_matches)

def load_countries(log):
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

#Create species table
def load_species(log):
    url_list = []
    log.print_message(" Loading Species ")
    with urllib.request.urlopen(ALL_SPECIES) as search:
        data = json.loads(search.read().decode())
        con = sl.connect('reptile.db')
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
        for i in range(len(entry_list)):
            log.print_message(" Checking Species %d of %d" % (i + 1, len(entry_list)))
            entry = json.loads(entry_list[i])
            distribution = entry['distribution']
            get_countries(all_species[i][0], distribution)




def main():
    log = logs.Log("reptile.db.log")
    create_tables(log)
    load_countries(log)
    load_species(log)

if __name__ == '__main__':
    main()
