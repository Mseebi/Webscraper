const rp = require('request-promise');
const cheerio = require("cheerio")
const json2csv = require("json2csv")
const fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var murl = "mongodb://localhost:27017/"


const url = 'https://www.imdb.com/search/title/?groups=top_1000&ref_=adv_prv';

(async() => {
    let data = []
    const response = await rp({
        uri: url/*
         headers:{
            accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*//*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8"
        },
        gzip: true, */
        //*/
    })
//I tried to create a function but it kept failing so I just hard coded it
    let $ = cheerio.load(response);
    let movies = [];
    $('h3 > a').each(function (j, e) {
        var a = $(this).text()
        var str = a.trim();
        str = str.replace(/\s(\s+)/gm,'');
        movies[j] = str;

    })

    let year = [];
    $('.lister-item-year').each(function (j, e) {
        var a = $(this).text();
        var str = a.trim();
        str = str.replace(/\s(\s+)/gm,'');
        year[j] = str;

    })

    let ratings = [];
    $('div > div > strong').each(function (j, e) {
        var a = $(this).text()
        var str = a.trim();
        str = str.replace(/\s(\s+)/gm,'');
        ratings[j] = str

    })
    
    let runtime = [];
    $('.runtime').each(function (j, e) {
        var a = $(this).text()
        var str = a.trim();
        str = str.replace(/\s(\s+)/gm,'');
        runtime[j] = str

    })
    let genre = []

    $('.genre').each(function (j, e) {
        var a = $(this).text()
        var str = a.trim();
        str = str.replace(/\s(\s+)/gm,'');
        genre[j] = str

    })
   /* var i = 0;
    while(i < movies.length){
        MongoClient.connect(murl, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = { tile: movies[i], year: year[i], runtime : runtime[i],  genre : genre[i] };
            dbo.collection("movies").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            });
            i++;
        });
    }*/

    console.log(movies);
    console.log(year);
    console.log(ratings);
    console.log(runtime);
    console.log(genre);

    const j2cp = new json2csv()
    const csv = j2cp.parse( movies, year, ratings, runtime, genre)
    fs.writeFileSync("./movie_scrap.csv", csv, "utf8");

})()

//
















