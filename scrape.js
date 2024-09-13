// scrape.js
const puppeteer = require("puppeteer");

async function scrapeLinkedInExperience(linkedinUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the LinkedIn profile URL
  await page.goto(linkedinUrl, { waitUntil: "networkidle2" });

  // Wait for the experience section to load
  await page.waitForSelector("section.artdeco-card.pv-profile-card");

  // Extract experience details
  const experienceData = await page.evaluate(() => {
    const experiences = [];

    // Select all experience blocks
    const experienceItems = document.querySelectorAll(
      "section.artdeco-card.pv-profile-card ul.SEJVqWNoNonwXMjBlKlbfyYUPCaxMgKhDdzdlM li.artdeco-list__item",
    );

    experienceItems.forEach((item) => {
      const title =
        item.querySelector("div.t-bold span")?.innerText || "No title";
      const company =
        item.querySelector("span.t-14.t-normal")?.innerText || "No company";
      const dates =
        item.querySelector("span.pvs-entity__caption-wrapper")?.innerText ||
        "No dates";
      const location =
        item.querySelector("span.t-black--light")?.innerText || "No location";
      const description =
        item.querySelector("div.inline-show-more-text--is-collapsed span")
          ?.innerText || "No description";

      experiences.push({ title, company, dates, location, description });
    });

    return experiences;
  });

  await browser.close();
  return experienceData;
}

// Accept LinkedIn URL from the command line
const linkedinProfileUrl = process.argv[2]; // The first argument after the script name
console.log(linkedinProfileUrl);
scrapeLinkedInExperience(linkedinProfileUrl)
  .then((experience) => {
    console.log("Experience:", experience);
  })
  .catch((error) => {
    console.error("Error scraping LinkedIn profile:", error);
  });
