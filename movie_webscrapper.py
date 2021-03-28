import requests
from requests import get
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import psycopg2
from sqlalchemy import create_engine

engine = create_engine('postgresql://postgres@localhost:5432/movies')

con = psycopg2.connect(database="newdb", user="postgres", password="postgres", host="localhost", port="5432")
cur = con.cursor()

url = "https://www.imdb.com/search/title/?groups=top_1000&ref_=adv_prv"
headers = {"Accept-Language": "en-US, en;q=0.5"}
results = requests.get(url, headers=headers)

soup = BeautifulSoup(results.text, "html.parser")

#initiate data storage
titles = []
years = []
time = []
imdb_ratings = []


movie_div = soup.find_all('div', class_='lister-item mode-advanced')

#our loop through each container
for container in movie_div:

        #name
        name = container.h3.a.text
        titles.append(name)
        
        #year
        year = container.h3.find('span', class_='lister-item-year').text
        years.append(year)

        # runtime
        runtime = container.p.find('span', class_='runtime').text if container.p.find('span', class_='runtime').text else '-'
        time.append(runtime)

        #IMDb rating
        imdb = float(container.strong.text)
        imdb_ratings.append(imdb)

arr_len = len(titles)
 
cur.execute(''' CREATE TABLE movies (
        title varchar, yearReleased varchar, runtime varchar, ratings varchar 
        );''')
con.commit()
print("Table created successfully")

i = 0
while i < arr_len:
        con = psycopg2.connect(database="newdb", user="postgres", password="postgres", host="localhost", port="5432")
        cur = con.cursor()
        cur.execute("INSERT INTO movies (title, yearReleased, runtime, ratings)VALUES (%s, %s, %s, %s);", (titles[i] , years[i] , time[i], imdb_ratings[i])) 
        i += 1
        con.commit()
        con.close()
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
#movie_csv_data = pd.read_csv(r'C:\Users\Siphe\OneDrive\Desktop\Momo\Stin\web\d\movies.csv')

