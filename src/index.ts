import { EquestApi } from "../equest";
import { Encryptor } from "../encryptor";
import { NEWS_DATA } from "../data";

async function main() {
  const equestApi = new EquestApi();
  const encryptionKey = "secret";
  const encryptor = new Encryptor(encryptionKey);

  // TEST EQUEST
  // let newRecordByHash = await equestApi.getNewsRecordByHash("testhash123");
  // console.log("findNewsRecordByHash", newRecordByHash.data);

  // const alphavNews = await equestApi.getAlphavNews("ibm");
  // console.log("getAlphavNews", alphavNews.data);

  // const marketauxNews = await equestApi.getMarketauxNews("ibm");
  // console.log("getMarketauxNews", marketauxNews.data);

  // const everythingNews = await equestApi.getNewsEverything("ibm");
  // console.log("getNewsEverything", everythingNews.data);

  // TEST ENCRYPTOR
  // const title = "This is a title that needs encrypting";
  // const encrypted = encryptor.encrypt(title);
  // console.log("🚀 ~ file: index.ts:21 ~ main ~ encrypted:", encrypted);
  // const decrypted = encryptor.decrypt(encrypted);
  // console.log("🚀 ~ file: index.ts:24 ~ main ~ decrypted:", decrypted);
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
  console.log(
    "🚀 ~ file: index.ts:47 ~ main ~ recordsInserted:",
    recordsInserted
  );
}

main();
