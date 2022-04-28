from . import blueprint
import json
import sqlite3 as sl
from flask import jsonify
from flask import request


@blueprint.route('/data/species', methods=['GET'])
def species():
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        species_out = {}
        species_queried = con.execute('SELECT * FROM SPECIES')
        desc = species_queried.description
        column_names = [col[0] for col in desc]
        for row in species_queried:
            species_out[row[0]] = dict(zip(column_names, row))
        return jsonify(species_out)

def get_endemic_species():
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        country_list = con.execute('SELECT CODE FROM COUNTRIES')
        lengths = []
        data = {}
        countries_out = {}
        for country in country_list:
            countries_out = con.execute('SELECT SpeciesName, Coverage FROM (SELECT * FROM SpeciesCountries GROUP BY SpeciesName HAVING COUNT(*) = 1) WHERE countriesname \'%s\''%(country[0]))
            lengths.append(len(countries_out[country[0]]))
        data["countries"] = countries_out
        data["min"] = min(lengths)
        data["max"] = max(lengths)
        return jsonify(data)


@blueprint.route('/data/countries', methods=['GET'])
def countries():
    c = request.args.get('type')
    if c == 'Endemic Species':
        return get_endemic_species()
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        #prepare output variable and output dict
        data = {}
        countries_out = {}
        #get all countries and turn into list
        country_list = con.execute('SELECT CODE FROM COUNTRIES')
        lengths = []
        sums = []
        for country in country_list:
            species = con.execute('SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES WHERE COUNTRIESNAME=\'%s\''%(country[0]))
            species_comprehension = [s for s in species]
            print(species_comprehension)
            countries_out[country[0]] = species_comprehension
            lengths.append(len(species_comprehension))
            sums.append(sum([s[1] for s in species_comprehension]))

        data["countries"] = countries_out
        if c == 'Species Counts':
            data["min"] = min(lengths)
            data["max"] = max(lengths)
        elif c == 'Species Density':
            data["min"] = min(sums)
            data["max"] = max(sums)

        return jsonify(data)


@blueprint.route('/data/world', methods=['GET'])
def world():
    data = None
    with open("static/world.geojson") as url:
        data = json.load(url)
    return data


@blueprint.route('/data/country', methods=['GET'])
def country():
    c = request.args.get('name')
    con = sl.connect('data_pipelines/reptile.db')
    species = con.execute('SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES WHERE COUNTRIESNAME=\'%s\''%(c))
    species_out = [s for s in species]
    return jsonify(species_out)
