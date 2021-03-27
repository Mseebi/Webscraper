const { fstat } = require('fs');
const json2csv = require("json2csv")
const puppeteer = require('puppeteer');
const rp = require('request-promise');
var MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

let mURL = "https://www.imdb.com/title/tt9784798/?ref_=adv_li_tt";
rp(mURL)
.then(function(html){
//success

(async () => {
    
    
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(mURL, {waitUntil: 'networkidle2'});

  
    let movieData = page.evaluate(() => {
        let nameOfMovie = document.querySelector('div[class="title_wrapper"] > h1').innerText;
        let imdbRatings = document.querySelector('span[itemprop="ratingValue"]').innerText;

        return{
            nameOfMovie,
            imdbRatings
        }
        movieData.push({
            nameOfMovie : nameOfMovie,
            imdbRatings: imdbRatings
        }) 
    });
    console.log(movieData);
    
    


  await browser.close();
}).catch(function(err){
    //handle error
  })
  const j2cp = new json2csv()
  const csv = j2cp.parse(movieData)
  fstat.writeFileSync("./movie_scrap.csv", csv, "utf8");
})

//write from the csv to the database

// let url = "mongodb://username:password@localhost:27017/";
let url = "mongodb://localhost:27017/";

csvtojson()
  .fromFile("movies.csv")
  .then(csvData => {
    console.log(csvData);

    mongodb.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;

        client
          .db("movies")
          .collection("category")
          .insertMany(csvData, (err, res) => {
            if (err) throw err;

            console.log(`Inserted: ${res.insertedCount} rows`);
            client.close();
          });
      }
    );
  });