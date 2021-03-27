import psycopg2

#establishing the connection
conn = psycopg2.connect(
   database="postgres", user='postgres', password='password', host='127.0.0.1'
)
conn.autocommit = True

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

#Preparing query to create a database
sql = '''CREATE database moviedb''';

#Creating a database
cursor.execute(sql)
print("Database created successfully........")

sql = '''\copy table FROM 'movies.csv' delimiter ',' csv '''

#Closing the connection
conn.close()