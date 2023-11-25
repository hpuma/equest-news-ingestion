import { NewsProcessor } from "./news-processor.class";
import { EquestApi } from "./equest.class";

interface TickerRecord {
  symbol: string;
  name: string;
  sector: string;
  country: string;
}

async function main() {
  const encryptionKey = "secret";
  const equestApi = new EquestApi();

  const { records, count } = await equestApi.getTickerRecords();
  console.log("🚀 TickerRecords => COUNT =>", count);

  const alphav: any[] = [];
  const marketaux: any[] = [];
  const news: any[] = [];

  for await (const record of records) {
    const { symbol: ticker } = record;
    const [alphavRes, marketauxRes, newsRes] = await Promise.all([
      equestApi.getNewsFromSource("alphav", ticker),
      equestApi.getNewsFromSource("marketaux", ticker),
      equestApi.getNewsFromSource("news", ticker),
    ]);
    if (!alphavRes.message) alphav.push(alphavRes);
    if (!marketauxRes.message) marketaux.push(marketauxRes);
    if (!newsRes.message) news.push(newsRes);
  }
  const totalArticlesDownloaded =
    alphav.length ?? 0 + marketaux.length ?? 0 + news.length ?? 0;
  console.log("🚀 TotalArticles => DOWNLOADED =>", totalArticlesDownloaded);

  const newsProcessor = new NewsProcessor(
    equestApi,
    {
      alphav,
      marketaux,
      news,
    },
    encryptionKey
  );

  await newsProcessor.processArticles();
  await newsProcessor.uploadNewsRecords();
}

main();
