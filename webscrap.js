const { fstat } = require('fs');
const json2csv = require("json2csv")
const puppeteer = require('puppeteer');
const rp = require('request-promise');

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