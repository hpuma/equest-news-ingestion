import { NEWS_DATA } from "./utils/data";
import { NewsProcessor } from "./news-processor.class";
import { EquestApi } from "./equest.class";

async function main() {
  const encryptionKey = "secret";

  const equestApi = new EquestApi();

  const newsProcessor = new NewsProcessor(equestApi, NEWS_DATA, encryptionKey);
  await newsProcessor.processArticles();
  await newsProcessor.uploadNewsRecords();
}

main();
