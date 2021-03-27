import psycopg2
import pandas as pd

con = psycopg2.connect(database="postgres", user="postgres", password="postgres", host="/var/run/postgresql", port="5432")

csv_file = "movies.csv"
print("Database opened successfully")


my_csv = pd.read_csv(csv_file)
df = pd.DataFrame(my_csv, columns=['movie', 'year', 'timeMin', 'imdb'])
print(df)
#})

cur = con.cursor()
cur.execute(''' CREATE TABLE dimovie (
    title varchar, yearReleased varchar, runtime varchar, ratings varchar 
);''')
print("Table created successfully")

cur.execute('''
            \copy dimovie FROM 'C:/Users/Siphe/OneDrive/Desktop/Momo/Stin/web/Day2/movies.csv' DELIMITER ',' CSV HEADER;
            ''')
        #'''cur.copy_from('C:/Users/Siphe/OneDrive/Desktop/Momo/Stin/web/Day2/movies.csv', dimovie, sep=',')''')


j = cur.execute('''SELECT * FROM dimovie;''')

print(j)