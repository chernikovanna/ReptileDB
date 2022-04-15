import asyncio
import aiohttp
import json
from aiohttp.client import ClientSession

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

async def download_link(url:str,session:ClientSession):
    async with session.get(url) as response:
        result = await response.text()
        print(result)

async def download_all(urls:list):
    my_conn = aiohttp.TCPConnector(limit=10)
    async with aiohttp.ClientSession(connector=my_conn) as session:
        tasks = []
        for url in urls:
            task = asyncio.ensure_future(download_link(url=url,session=session))
            tasks.append(task)
        await asyncio.gather(*tasks,return_exceptions=True) # the await must be nest inside of the session

url_list = []
with open("species.json") as url:
    data = json.load(url)
    ugh = [d for d in enumerate(data)]
    for chunk in chunks(ugh, 5):
        for i in range(len(chunk)):
            species_name = chunk[i][1]
            g = species_name.split(" ")[0]
            s = species_name.split(" ")[1]
            u = "https://api.reptile-database.org/spatial?genus=" + g + "&species=" + s
            url_list.append(u)


asyncio.run(download_all(url_list))
