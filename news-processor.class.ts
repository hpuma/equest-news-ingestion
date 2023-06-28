import { EquestApi } from "./equest-api.class";
import { Encryptor } from "./encryptor.class";
import { NEWS_DATA } from "./data";

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
    if (!this.data.articles.length) {
      console.log("Articles PROCESSED: 0");
      return;
    }
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
    console.log(`Articles PROCESSED: ${this.newArticles.length}`);
  }
  async uploadNewsRecords() {
    if (!this.newArticles.length) {
      console.log("Records UPLOADED: 0");
      return;
    }

    const { data } = await this.equestApi.uploadNewsRecords({
      articles: this.newArticles,
      count: this.newArticles.length,
    });

    console.log(`Records UPLOADED: ${data.insertedCount}`);
    console.table(data);
  }
}
