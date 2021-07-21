const puppeteer = require("puppeteer");

async function scrapeAPI(url) {
  console.log("Fetching items, this may take a bit...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const nameArray = await page.evaluate(
    () =>
      [...document.querySelectorAll("h3.c-subheading-6")].map(
        (partner) => partner.innerText
      ) //Gets list of all items for sale (currently only supports up to 90 per page)
  );

  const priceArray = await page.evaluate(
    () =>
      [...document.querySelectorAll("div div span.x-screen-reader")].map(
        (partner) => partner.innerText
      )
  );

  let price = priceArray;
  price = priceArray.filter((e) => e !== "Game Pass"); // Filters out unwanted items

  let filterout = price;
  filterout = price.filter((e) => e !== "filtered by"); // Filters out "filtered by"

  let filteroutGold = filterout;
  filteroutGold = filterout.filter((e) => e !== "Gold"); // Filters out "Games with Gold Price"

  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");

  // Put price information into a multidimensional array (Full and Now Price)
  function TwoDimensional(arr, size) {
    var res = [];
    for (var i = 0; i < arr.length; i = i + size)
      res.push(arr.slice(i, i + size));
      return res
  }
  let multidimensionalPriceArray = TwoDimensional(filteroutGold, 2);
  // console.log(multidimensionalPriceArray)
  
  // Output first 50 Deals 
  for (let i = 0; i < 50; i++) {
    console.log(nameArray[i] + " | " + " " + multidimensionalPriceArray[i][0] + ", " + multidimensionalPriceArray[i][1]);
  }
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++");
  browser.close();
}

scrapeAPI("https://www.microsoft.com/en-us/store/deals/games/xbox");
