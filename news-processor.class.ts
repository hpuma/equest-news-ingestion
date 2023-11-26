import { EquestApi } from "./equest.class";
import { Encryptor } from "./utils/encryptor.class";
import { Timer } from "./utils/timer.class";

type Source = {
  [key: string]: any[any];
};

export class NewsProcessor extends Timer {
  private equestApi: EquestApi;
  private encryptor: Encryptor;

  private newsSources: Source;
  private newArticles: any[] = [];
  private totalProcessed = 0;

  constructor(equestApi: EquestApi, data: any, encryptionKey: string) {
    super();
    this.newsSources = {
      alphav: data.alphav,
      marketaux: data.marketaux,
      news: data.news,
    };
    this.equestApi = equestApi;
    this.encryptor = new Encryptor(encryptionKey);
    this.newArticles = [];
  }
  async processArticles() {
    this.startTimer(true);
    const allNewsSources = Object.keys(this.newsSources);
    for await (const source of allNewsSources)
      await this.processArticlesBySource(source);
  }

  async processArticlesBySource(newsSource: string) {
    const data = this.newsSources[newsSource];

    for await (const source of data) {
      this.startTimer();
      let currentProcessed = 0;
      const { articles = [], ticker = "" } = source;

      if (!articles.length) {
        this.printTimer(newsSource, `${ticker} [EMPTY]`, 0);
        continue;
      }

      for (const article of articles) {
        const filteredText = article.title.replace(" ", "");
        const hash = this.encryptor.encrypt(filteredText);

        const { data } = await this.equestApi.getNewsRecordByHash(hash);
        if (data) continue;

        this.newArticles.push({
          ...article,
          hash,
          timestamp: undefined,
          ticker,
          newsSource,
        });
        this.totalProcessed += 1;
        currentProcessed += 1;
      }

      this.printTimer(newsSource, `${ticker} PROCESSED`, currentProcessed);
    }
  }

  async uploadNewsRecords() {
    this.startTimer();

    if (!this.newArticles.length)
      return this.printTimer("TotalArticles", "UPLOADED", 0);

    const payload = {
      articles: this.newArticles,
      count: this.newArticles.length,
    };

    const {
      data: { insertedCount = 0 },
    } = await this.equestApi.uploadNewsRecords(payload);

    this.printTimer("TotalArticles", "UPLOADED", insertedCount);
    this.newArticles = [];
  }
}
