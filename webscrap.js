const puppeteer = require('puppeteer');
const rp = require('request-promise');

(async () => {
    let mURL = "https://www.imdb.com/title/tt9784798/?ref_=adv_li_tt";
    
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    rp(mURL)
  .then(function(html){
    //success
    await page.goto(mURL, {waitUntil: 'networkidle2'});

    let movieData = await page.evaluate(() => {
        let nameOfMovie = document.querySelector('div[class="title_wrapper"] > h1').innerText;
        let imdbRatings = document.querySelector('span[itemprop="ratingValue"]').innerText;

        return{
            nameOfMovie,
            imdbRatings
        }
    });
    console.log(movieData);
    await browser.close();
    
 })
 .catch(function(err){
    //handle error
  })
})();