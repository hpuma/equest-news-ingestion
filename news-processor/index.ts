import { EquestApi } from "../equest";
import { Encryptor } from "../encryptor";
import { NEWS_DATA } from "../data";

export class NewsProcessor {
  equestApi: EquestApi;
  encryptor: Encryptor;
  data: typeof NEWS_DATA;
  newArticles: any[] = [];

  constructor(data: any, encryptionKey: string) {
    this.data = data;
    this.equestApi = new EquestApi();
    this.encryptor = new Encryptor(encryptionKey);
  }
  async processArticles() {
    const { articles, ticker } = this.data;

    for (const article of articles) {
      const filteredText = article.title.replace(" ", "");
      const createdHash = this.encryptor.encrypt(filteredText);
      const { data } = await this.equestApi.getNewsRecordByHash(createdHash);

      if (!data)
        this.newArticles.push({
          ...article,
          hash: createdHash,
          timestamp: undefined,
          ticker,
        });
    }
    console.log("Articles PROCESSED: ", this.newArticles.length);
  }
  async uploadNewsRecords() {
    const { data } = await this.equestApi.uploadNewsRecords({
      articles: this.newArticles,
      count: this.newArticles.length,
    });
    console.log("Records UPLOADED:");
    console.table(data);
  }
}
