from . import blueprint
import json
import sqlite3 as sl
from flask import jsonify
from flask import request
import re


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

def get_endemic_species(y1, y2):
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        country_list = con.execute('SELECT CODE FROM COUNTRIES')
        lengths = []
        data = {}
        countries_out = {}
        for country in country_list:
            countries_out[country[0]] = con.execute("""SELECT SpeciesName, Coverage FROM (SELECT * FROM SpeciesCountries GROUP
             BY SpeciesName HAVING COUNT(*) = 1) WHERE CountriesName =\'%s\'
             AND SPECIESNAME in (SELECT name from Species WHERE year <= %d and year >= %d)"""%(country[0].upper(), int(y2), int(y1))).fetchall()
            lengths.append(len(countries_out[country[0]]))
        lengths = list(set(lengths))
        lengths.remove(0)
        data["countries"] = countries_out
        data["min"] = min(lengths)
        data["max"] = max(lengths)
        return jsonify(data)


@blueprint.route('/data/countries', methods=['GET'])
def countries():
    QUERY_STR = """SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES
    WHERE COUNTRIESNAME=\'%s\' AND SPECIESNAME in (SELECT name from Species WHERE year <= %d and year >= %d)"""
    # Argsss
    c = request.args.get('type')
    y1 = request.args.get('year_start')
    y2 = request.args.get('year_fin')
    t = request.args.get('taxa')
    #parse parameters
    if y1 == "undefined" or y2 == "undefined":
        y1, y2 = getYears()
    if t != "All Taxas":
        QUERY_STR = """SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES
        WHERE COUNTRIESNAME=\'%s\' AND SPECIESNAME in (SELECT name from Species WHERE year <= %d and year >= %d
        AND taxa like \'%%%s%%\')"""


    if c == 'Endemic Species':
        return get_endemic_species(y1, y2)
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        #prepare output variable and output dict
        data = {}
        countries_out = {}
        #get all countries and turn into list
        country_list = con.execute('SELECT CODE FROM COUNTRIES').fetchall()
        lengths = []
        sums = []
        for country in country_list:
            if t != "All Taxas":
                species = con.execute(QUERY_STR%(country[0].upper(), int(y2), int(y1), t)).fetchall()
            else:
                species = con.execute(QUERY_STR%(country[0].upper(), int(y2), int(y1))).fetchall()
            countries_out[country[0]] = species
            lengths.append(len(species))
            sums.append(sum([s[1] for s in species]))
        sums = list(set(sums))
        sums.remove(0)
        lengths = list(set(lengths))
        lengths.remove(0)
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
    species_out = con.execute('SELECT SPECIESNAME, COVERAGE FROM SPECIESCOUNTRIES WHERE COUNTRIESNAME=\'%s\''%(c)).fetchall()
    return jsonify(species_out)

def getYears():
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        years = con.execute('SELECT year FROM SPECIES').fetchall()
        return (min(years)[0], max(years)[0])

@blueprint.route('/data/year', methods=['GET'])
def years():
    data = {}
    data["min"], data["max"] = getYears();
    return jsonify(data)

@blueprint.route('/data/taxas', methods=['GET'])
def taxas():
    con = sl.connect('data_pipelines/reptile.db')
    full_taxa_list = []
    with con:
        taxas = con.execute('SELECT taxa from Species').fetchall()
        for taxa in taxas:
            taxa = re.split(r'(?<!\(),(?![\w\s]*[\)])|;',taxa[0].strip())
            full_taxa_list.extend(taxa)
    full_taxa_list = list(set(full_taxa_list))
    full_taxa_list.append("All Taxas")


    return jsonify(full_taxa_list)
