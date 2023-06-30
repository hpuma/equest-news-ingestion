import { EquestApi } from "./equest.class";
import { Encryptor } from "./utils/encryptor.class";
import { NEWS_DATA } from "./utils/data";
type Source = {
  [key: string]: typeof NEWS_DATA;
};

export class NewsProcessor {
  equestApi: EquestApi;
  encryptor: Encryptor;

  source: Source;
  newArticles: any[] = [];
  private startTime: any;

  constructor(equestApi: EquestApi, data: any, encryptionKey: string) {
    this.source = {
      alphav: data.alpahvResponse,
      marketaux: data.marketauxResponse,
      news: data.newsResponse,
    };
    this.equestApi = equestApi;
    this.encryptor = new Encryptor(encryptionKey);
    this.newArticles = [];
  }
  async processArticles() {
    const allSources = Object.keys(this.source);
    const processedArticles: any[] = [];
    allSources.forEach((source) => {
      processedArticles.push(this.processArticlesBySource(source));
    });
    await Promise.all(processedArticles);
  }

  async processArticlesBySource(source: string) {
    this.startTimer();
    const dataSource = this.source[source];

    if (!dataSource.articles.length) {
      console.log("Articles PROCESSED: 0");
      return;
    }

    const { articles, ticker } = dataSource;

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
    this.printTimer(source, `${ticker} PROCESSED`, this.newArticles.length);
  }

  startTimer() {
    this.startTime = Date.now();
  }
  printTimer(source: string = "", message: string = "", count: number = 0) {
    let timeTaken = Date.now() - this.startTime;
    console.log(`${source} => ${message} => ${count}  ...${timeTaken} ms`);
  }

  async uploadNewsRecords() {
    if (!this.newArticles.length) {
      console.table({
        acknowledged: false,
        insertedCount: 0,
        message: "No new articles",
      });
      return;
    }

    const { data } = await this.equestApi.uploadNewsRecords({
      articles: this.newArticles,
      count: this.newArticles.length,
    });

    console.log(data);
  }
}
