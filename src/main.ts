import { PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: {
      headless: true,
    },
  },

  maxRequestsPerCrawl: 50,

  // The function accepts a single parameter, which is an object with a lot of properties,
  // the most important being:
  // - request: an instance of the Request class with information such as URL and HTTP method
  // - page: Playwright's Page object (see https://playwright.dev/docs/api/class-page)
  async requestHandler({ pushData, request, page, enqueueLinks, log }) {
    log.info(`Processing ${request.url}...`);

    const data = await page.$$eval(".athing", ($posts) => {
      const scrapedData: { title: string; rank: string; href: string }[] = [];

      // We're getting the title, rank and URL of each post on Hacker News.
      $posts.forEach(($post) => {
        scrapedData.push({
          title: ($post.querySelector(".title a") as HTMLElement)?.innerText,
          rank: ($post.querySelector(".rank") as HTMLElement)?.innerText,
          href: ($post.querySelector(".title a") as HTMLAnchorElement)?.href,
        });
      });

      return scrapedData;
    });

    // Store the results to the default dataset.
    await pushData(data);

    // Find a link to the next page and enqueue it if it exists.
    const infos = await enqueueLinks({
      selector: ".morelink",
    });

    if (infos.processedRequests.length === 0)
      log.info(`${request.url} is the last page!`);
  },

  // This function is called if the page processing failed more than maxRequestRetries+1 times.
  failedRequestHandler({ request, log }) {
    log.info(`Request ${request.url} failed too many times.`);
  },
});

await crawler.addRequests(["https://news.ycombinator.com/"]);

await crawler.run();

console.log("Crawler finished.");
