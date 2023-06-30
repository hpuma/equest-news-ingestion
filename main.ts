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

  const totalArticlesDownloaded =
    alpahvResponse.articles.length ??
    0 + marketauxResponse.articles.length ??
    0 + newsResponse.articles.lengt ??
    0;

  console.log(`🚀 TotalArticles => DOWNLOADED => ${totalArticlesDownloaded}`);

  const newsProcessor = new NewsProcessor(
    equestApi,
    {
      alpahvResponse,
      marketauxResponse,
      newsResponse,
    },
    encryptionKey
  );

  await newsProcessor.processArticles();
  await newsProcessor.uploadNewsRecords();
}

main();
