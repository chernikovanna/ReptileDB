from . import blueprint
import json
import sqlite3 as sl
from flask import jsonify

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

@blueprint.route('/data/countries', methods=['GET'])
def countries():
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        countries_out = {}
        country_list = con.execute('SELECT CODE FROM COUNTRIES')
        for country in country_list:
            species = con.execute('SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES WHERE COUNTRIESNAME=\'%s\''%(country[0]))
            countries_out[country[0]] = [s for s in species]
        return jsonify(countries_out)


@blueprint.route('/data/world', methods=['GET'])
def world():
    data = None
    with open("static/world.geojson") as url:
        data = json.load(url)
    return data
