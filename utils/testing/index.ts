import { EquestApi } from "../../equest-api.class";
import { Encryptor } from "../../encryptor.class";

async function main() {
  const equestApi = new EquestApi();
  const encryptionKey = "secret";
  const encryptor = new Encryptor(encryptionKey);

  // TEST EQUEST
  let newRecordByHash = await equestApi.getNewsRecordByHash("testhash123");
  console.log("findNewsRecordByHash", newRecordByHash.data);

  const alphavNews = await equestApi.getAlphavNews("ibm");
  console.log("getAlphavNews", alphavNews.data);

  const marketauxNews = await equestApi.getMarketauxNews("ibm");
  console.log("getMarketauxNews", marketauxNews.data);

  const everythingNews = await equestApi.getNewsEverything("ibm");
  console.log("getNewsEverything", everythingNews.data);

  // TEST ENCRYPTOR
  const title = "This is a title that needs encrypting";
  const encrypted = encryptor.encrypt(title);
  console.log("🚀 ~ file: index.ts:21 ~ main ~ encrypted:", encrypted);
  const decrypted = encryptor.decrypt(encrypted);
  console.log("🚀 ~ file: index.ts:24 ~ main ~ decrypted:", decrypted);
}

main();
