import { NewsProcessor } from "./newsprocessor/news-processor.class";
import { EquestApi } from "./equest.class";

interface Results {
  [key: string]: any[]; // Define an index signature to specify that the keys are strings and the values are arrays of any type
}

async function main() {
  const encryptionKey = "secret";
  const equestApi = new EquestApi();

  const { records, count } = await equestApi.getTickerRecords();
  console.log("🚀 Ticker => COUNT =>", count);

  const integrations = [
    "alphav",
    "marketaux",
    "news",
    "bing",
    "newsdata",
    "gnews",
    "thenews",
  ];
  const results: Results = {}; // Specify the type of the results object

  for await (const { symbol: ticker } of records) {
    const requests = integrations.map((integration) =>
      equestApi.getNewsFromSource(integration, ticker)
    );
    const responses = await Promise.all(requests);

    responses.forEach((res, index) => {
      if (!res.message) {
        results[integrations[index]] = results[integrations[index]] || [];
        results[integrations[index]].push(res);
      }
    });
  }

  const newsProcessor = new NewsProcessor(equestApi, results, encryptionKey);
  await newsProcessor.processArticles();
  await newsProcessor.uploadNewsRecords();
}

main();
