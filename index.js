const puppeteer = require("puppeteer");
require("dotenv").config();

const { AEM_HOST, AEM_USER, AEM_PASSWORD, HEADLESS } = process.env;

const headless = HEADLESS === "true";
(async () => {
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();

  console.log("Naving to login page...");
  await page.goto(AEM_HOST);

  // expand the local login
  console.log("Opening local login...");
  (await page.$("#coral-id-0")).click();
  await page.waitForSelector("#username");

  // login
  console.log("Entering credentials...");
  await page.focus("#username");
  await page.keyboard.type(AEM_USER);
  await page.focus("#password");
  await page.keyboard.type(AEM_PASSWORD);

  console.log("Logging in...");
  (await page.$("#submit-button")).click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  // navigate to the assets homepage
  console.log("Clicking assets link...");
  (await page.$("coral-icon[icon=asset]")).click();
  await page.waitForSelector("coral-icon[icon=folder]");
  console.log("Opening Assets folder view...");
  (await page.$("coral-icon[icon=folder]")).click();
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log("Done!");
  await browser.close();
})();
