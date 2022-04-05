import requests
from datapackage import Package
import json
import urllib.request, json
from shapely.geometry import shape
from multiprocessing.dummy import Pool as ThreadPool
import time

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

def get_status(species_name):
    global species
    g = species_name.split(" ")[0]
    s = species_name.split(" ")[1]
    u = "https://api.reptile-database.org/spatial?genus=" + g + "&species=" + s
    with urllib.request.urlopen(u) as url_inner:
       response = requests.get(u)
       if 'Content-Type' in response.headers.keys():
           entry = json.loads(url_inner.read().decode())
           species[species_name] = entry["geometry"]
    return response.status_code

species = {}
species_names = []
with open("species.json") as url:
    data = json.load(url)
    ugh = [d for d in enumerate(data)]
    for chunk in chunks(ugh, 5):
        for i in range(len(chunk)):
            species_name = chunk[i][1]
            species_names.append(species_name)

        pool = ThreadPool(5)  # Make the Pool of workers
        results = pool.map(get_status, species_names) #Open the urls in their own threads
        pool.close() #close the pool and wait for the work to finish
        pool.join()
        print(species.keys())
        time.sleep(1)


out_f = open("species_shapes.json", "w")
print(json.dumps(species), file=out_f)
out_f.close()
