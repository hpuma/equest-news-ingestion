import { EquestApi } from "../equest";
import { Encryptor } from "../encryptor";
import { NEWS_DATA } from "../data";

async function main() {
  const equestApi = new EquestApi();
  const encryptionKey = "secret";
  const encryptor = new Encryptor(encryptionKey);

  const { articles, ticker } = NEWS_DATA;

  let newArticles: any = [];

  for (const article of articles) {
    const { title } = article;
    const createdHash = encryptor.encrypt(title.replace(" ", ""));

    const { data } = await equestApi.getNewsRecordByHash(createdHash);
    const newRecord = {
      ...article,
      hash: createdHash,
      timestamp: undefined,
      ticker,
    };

    if (!data) newArticles.push(newRecord);
  }
  console.log("🚀 ~ file: index.ts:27 ~ main ~ newArticles:", newArticles);
  const { data: recordsInserted } = await equestApi.uploadNewsRecords({
    articles: newArticles,
    count: newArticles.length,
  });
  console.log("🚀recordsInserted:", recordsInserted);
}

main();
