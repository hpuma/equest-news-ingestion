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
      this.startTimer(newsSource, `ARTICLES ADDED ✅ => ${ticker}`);
      const articlesWithHash = articles.map((article: any) =>
        this.genereateHashFromTitle(article, ticker, newsSource)
      );
      const hashList = articlesWithHash.map((article: any) => article.hash);

      const { duplicates, count: duplicateCount } =
        await this.equestApi.getDuplicateNewsrecords(hashList);

      if (duplicateCount === articleCount) {
        this.printTimer(0);
        continue;
      }

      const { newArticles = [], consoleMessage } = this.removeDuplicatedRecords(
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

  private genereateHashFromTitle(
    article: any,
    ticker: string,
    newsSource: string
  ) {
    const { title = "" } = article;

    return {
      ...article,
      hash: this.encryptor.encrypt(title.replace(" ", "")),
      ticker,
      newsSource,
    };
  }

  private removeDuplicatedRecords(
    articlesWithHash: any[],
    duplicates: any[],
    duplicateCount: number
  ): { newArticles: any[]; consoleMessage: string } {
    const hasDuplicates = duplicateCount > 0;
    const consoleMessage = hasDuplicates ? "DUPLICATES" : "NO DUPLICATES";

    return {
      newArticles: hasDuplicates
        ? articlesWithHash.filter(
            (article: any) => !duplicates.includes(article.hash)
          )
        : articlesWithHash,
      consoleMessage,
    };
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
