import { NEWS_DATA } from "./utils/data";
import { NewsProcessor } from "./news-processor.class";
import { EquestApi } from "./equest.class";
import { endpoint } from "./equest.class";

async function main() {
  const encryptionKey = "secret";

  const equestApi = new EquestApi();

  const ticker = "IBM";
  const [alpahvResponse, marketauxResponse, newsResponse] = await Promise.all([
    equestApi.getNewsFromSource("alphav", ticker),
    equestApi.getNewsFromSource("marketaux", ticker),
    equestApi.getNewsFromSource("news", ticker),
  ]);
  printStats("alphav", alpahvResponse);
  printStats("marketaux", marketauxResponse);
  printStats("news", newsResponse);

  // const newsProcessor = new NewsProcessor(equestApi, NEWS_DATA, encryptionKey);
  // await newsProcessor.processArticles();
  // await newsProcessor.uploadNewsRecords();
}

function printStats(source: string, data: any) {
  console.log(source, Object.keys(data), `Count: ${data.count}`);
}

main();
