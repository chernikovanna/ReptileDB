import asyncio
import aiohttp
import json
from aiohttp.client import ClientSession


class Aio():
    def __init__(self, url_list):
        self.url_list = url_list
        self.return_list = {}

    def run(self):
        asyncio.run(self.download_all(self.url_list))
        return self.return_list

    async def download_link(self,url:str,session:ClientSession):
        async with session.get(url) as response:
            result = await response.text()
            self.return_list[url] = result

    async def download_all(self, urls:list):
        my_conn = aiohttp.TCPConnector(limit=10)
        async with aiohttp.ClientSession(connector=my_conn) as session:
            tasks = []
            for url in urls:
                task = asyncio.ensure_future(self.download_link(url=url,session=session))
                tasks.append(task)
            await asyncio.gather(*tasks,return_exceptions=True)
