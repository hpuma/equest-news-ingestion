import { EquestApi } from "../equest.class";
import { Timer } from "../utils/timer.class";
import { Helper } from "./helper.class";

type Source = {
  [key: string]: any[any];
};

export class NewsProcessor extends Timer {
  private equestApi: EquestApi;
  private helper: Helper;

  private newsSources: Source;
  private newArticles: any[] = [];

  constructor(equestApi: EquestApi, data: any, encryptionKey: string) {
    super();
    this.newsSources = {
      alphav: data.alphav,
      marketaux: data.marketaux,
      news: data.news,
    };
    this.equestApi = equestApi;
    this.helper = new Helper(encryptionKey);
    this.newArticles = [];
  }
  async processArticles() {
    this.startTimer("Processing", "DONE", true);
    const allNewsSources = Object.keys(this.newsSources);
    for await (const source of allNewsSources)
      await this.processArticlesBySource(source);
    this.printTimer(this.newArticles.length, true);
  }

  async processArticlesBySource(newsSource: string) {
    const data = this.newsSources[newsSource].filter(
      (data: any) => data.count > 0
    );

    if (!data.length) return;

    for await (const {
      articles = [],
      ticker = "",
      count: articleCount,
    } of data) {
      this.startTimer(newsSource, `TOTAL PROCESSED✅ => ${ticker}`);
      const articlesWithHash = articles.map((article: any) =>
        this.helper.genereateHashFromTitle(article, ticker, newsSource)
      );

      const hashList = articlesWithHash.map((article: any) => article.hash);

      const { duplicates, count: duplicateCount } =
        await this.equestApi.getDuplicateNewsrecords(hashList);

      if (duplicateCount === articleCount) {
        this.printTimer(0);
        continue;
      }

      const { newArticles = [], consoleMessage } =
        this.helper.removeDuplicatedRecords(
          articlesWithHash,
          duplicates,
          duplicateCount
        );

      console.log(
        `🚀 ${newsSource} => ${consoleMessage} => ${ticker} => ${duplicateCount}`
      );

      this.newArticles = [...this.newArticles, ...newArticles];
      this.printTimer(newArticles.length);
    }
  }

  async uploadNewsRecords() {
    this.startTimer("Total Articles", "UPLOADED");

    if (!this.newArticles.length) return this.printTimer(0);

    const payload = {
      articles: this.newArticles,
      count: this.newArticles.length,
    };

    const { insertedCount = 0 } = await this.equestApi.uploadNewsRecords(
      payload
    );

    return this.printTimer(insertedCount);
  }
}
