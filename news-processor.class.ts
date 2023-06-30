import { EquestApi } from "./equest.class";
import { Encryptor } from "./utils/encryptor.class";
import { NEWS_DATA } from "./utils/data";
type Source = {
  [key: string]: typeof NEWS_DATA;
};

export class NewsProcessor {
  private equestApi: EquestApi;
  private encryptor: Encryptor;

  private newsSources: Source;
  private newArticles: any[] = [];
  private processedCount = 0;

  private startTime: any;

  constructor(equestApi: EquestApi, data: any, encryptionKey: string) {
    this.newsSources = {
      alphav: data.alpahvResponse,
      marketaux: data.marketauxResponse,
      news: data.newsResponse,
    };

    this.equestApi = equestApi;
    this.encryptor = new Encryptor(encryptionKey);
    this.newArticles = [];
  }
  async processArticles() {
    const allNewsSources = Object.keys(this.newsSources);

    allNewsSources.forEach(async (source) => {
      await this.processArticlesBySource(source);
    });

    console.log(`PROCESSED ${this.newArticles.length} articles`);
  }

  async processArticlesBySource(source: string) {
    this.startTimer();
    this.processedCount = 0;
    const dataSource = this.newsSources[source];

    const { articles, ticker } = dataSource;

    for (const article of articles) {
      const filteredText = article.title.replace(" ", "");
      const createdHash = this.encryptor.encrypt(filteredText);
      const { data } = await this.equestApi.getNewsRecordByHash(createdHash);

      if (!data) {
        this.newArticles.push({
          ...article,
          hash: createdHash,
          timestamp: undefined,
          ticker,
        });
        this.processedCount += 1;
      }
    }

    this.printTimer(source, `${ticker} PROCESSED`, this.processedCount);
  }

  startTimer() {
    this.startTime = Date.now();
  }
  printTimer(source: string = "", message: string = "", count: number = 0) {
    let timeTaken = Date.now() - this.startTime;
    console.log(`🚀 ${source} => ${message} => ${count}  ...${timeTaken}ms`);
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
