import { EquestApi } from "../equest.class.ts";
import { Encryptor } from "./encryptor.class.ts";

async function main() {
  const equestApi = new EquestApi();
  const encryptionKey = "secret";
  const encryptor = new Encryptor(encryptionKey);

  // TEST EQUEST

  const alphavNews = await equestApi.getNewsFromSource("alphav", "ibm");
  console.log("getAlphavNews", alphavNews.data);

  const marketauxNews = await equestApi.getNewsFromSource("marketaux", "ibm");
  console.log("getMarketauxNews", marketauxNews.data);

  const everythingNews = await equestApi.getNewsFromSource("news", "ibm");
  console.log("getNewsEverything", everythingNews.data);

  // TEST ENCRYPTOR
  const title = "This is a title that needs encrypting";
  const encrypted = encryptor.encrypt(title);
  console.log("🚀 ~ file: index.ts:21 ~ main ~ encrypted:", encrypted);
  const decrypted = encryptor.decrypt(encrypted);
  console.log("🚀 ~ file: index.ts:24 ~ main ~ decrypted:", decrypted);
}

main();
