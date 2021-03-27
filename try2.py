import csv
from io import StringIO
from sqlalchemy import create_engine
import pandas as pd
import psycopg2

def dbConnect (db_parm, username_parm, host_parm, pw_parm):
    # Parse in connection information
    conn = psycopg2.connect(database="postgres", user="postgres", password="postgres", host="/var/run/postgresql", port="5432")
    conn.autocommit = True  # auto-commit each entry to the database
    #conn.cursor_factory = RealDictCursor
    cur = conn.cursor()
    return conn, cur

conn, cur = dbConnect("postgres", "postgres", "/var/run/postgresql", "postgres")
#port="5432"
csv_file = "movies.csv"
my_csv = pd.read_csv(csv_file)
df = pd.DataFrame(my_csv, columns=['movie', 'year', 'timeMin', 'imdb'])

output = StringIO(csv_file) # For Python3 use StringIO
df.to_csv(output, sep='\t', header=True, index=False)
output.seek(0) # Required for rewinding the String object
copy_query = "COPY movies FROM STDOUT csv DELIMITER '\t' NULL ''  ESCAPE '\\' HEADER "
cur.copy_expert(copy_query, output)
print(output)
conn.commit()