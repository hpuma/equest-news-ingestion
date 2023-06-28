import { NEWS_DATA } from "./utils/data";
import { NewsProcessor } from "./news-processor.class";

async function main() {
  const encryptionKey = "secret";
  const newsProcessor = new NewsProcessor(NEWS_DATA, encryptionKey);
  await newsProcessor.processArticles();
  await newsProcessor.uploadNewsRecords();
}

main();
