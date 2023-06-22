import { EquestApi } from "../equest";
import { Encryptor } from "../encryptor";
import { NEWS_DATA } from "../data";

async function main() {
  const equestApi = new EquestApi();
  const encryptionKey = "secret";
  const encryptor = new Encryptor(encryptionKey);

  const { articles } = NEWS_DATA;

  let newArticles: any = [];

  for (const article of articles) {
    const { title } = article;
    const createdHash = encryptor.encrypt(title.replace(" ", ""));

    const { data } = await equestApi.getNewsRecordByHash(createdHash);
    const newRecord = { ...article, hash: createdHash, timestamp: undefined };

    if (!data) newArticles.push(newRecord);
  }

  const { data: recordsInserted } = await equestApi.uploadNewsRecords({
    articles: newArticles,
    count: newArticles.length,
  });
  console.log("🚀recordsInserted:", recordsInserted);
}

main();
