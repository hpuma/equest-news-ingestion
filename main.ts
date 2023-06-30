import { NewsProcessor } from "./news-processor.class";
import { EquestApi } from "./equest.class";
import { NEWS_DATA } from "./utils/data";
async function main() {
  const encryptionKey = "secret";

  const equestApi = new EquestApi();

  const ticker = "IBM";
  const [alpahvResponse, marketauxResponse, newsResponse] = await Promise.all([
    equestApi.getNewsFromSource("alphav", ticker),
    equestApi.getNewsFromSource("marketaux", ticker),
    equestApi.getNewsFromSource("news", ticker),
  ]);

  const newsProcessor = new NewsProcessor(
    equestApi,
    {
      alpahvResponse: NEWS_DATA,
      marketauxResponse: NEWS_DATA,
      newsResponse: NEWS_DATA,
    },
    encryptionKey
  );
  await newsProcessor.processArticles();

  // const alphavProcessor = new NewsProcessor(
  //   equestApi,
  //   alpahvResponse,
  //   encryptionKey
  // );
  // const marketauxProcessor = new NewsProcessor(
  //   equestApi,
  //   marketauxResponse,
  //   encryptionKey
  // );
  // const newsProcessor = new NewsProcessor(
  //   equestApi,
  //   newsResponse,
  //   encryptionKey
  // );

  // await Promise.all([
  //   alphavProcessor.processArticles(),
  //   newsProcessor.processArticles(),
  //   newsProcessor.processArticles(),
  // ]);

  // await Promise.all([
  //   alphavProcessor.uploadNewsRecords(),
  //   marketauxProcessor.uploadNewsRecords(),
  //   newsProcessor.uploadNewsRecords(),
  // ]);
}

main();
