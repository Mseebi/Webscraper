import requests
from requests import get
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np

url = "https://www.imdb.com/search/title/?groups=top_1000&ref_=adv_prv"
headers = {"Accept-Language": "en-US, en;q=0.5"}
results = requests.get(url, headers=headers)

soup = BeautifulSoup(results.text, "html.parser")

#arrays to store movie data
titles = []
years = []
time = []
imdb_ratings = []

movie_div = soup.find_all('div', class_='lister-item mode-advanced')

#our loop through each x
for x in movie_div:

        #name
        name = x.h3.a.text
        titles.append(name)
        
        #year
        year = x.h3.find('span', class_='lister-item-year').text
        years.append(year)

        # runtime
        runtime = x.p.find('span', class_='runtime').text if x.p.find('span', class_='runtime').text else '-'
        time.append(runtime)

        #IMDb rating
        imdb = float(x.strong.text)
        imdb_ratings.append(imdb)


#pandas dataframe        
movies = pd.DataFrame({
'movie': titles,
'year': years,
'timeMin': time,
'imdb': imdb_ratings
})

#cleaning data 
movies['year'] = movies['year'].str.extract('(\d+)').astype(int)
movies['timeMin'] = movies['timeMin'].str.extract('(\d+)').astype(int)
#add dataframe to csv file named 'movies.csv'
movies.to_csv('movies.csv')