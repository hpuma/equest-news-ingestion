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
    this.startTimer(true);
    const allNewsSources = Object.keys(this.newsSources);
    for await (const source of allNewsSources)
      await this.processArticlesBySource(source);
    this.printTimer("Processing", `DONE`, this.newArticles.length, true);
  }

  async processArticlesBySource(newsSource: string) {
    const data = this.newsSources[newsSource];

    for await (const {
      articles = [],
      ticker = "",
      count: articleCount,
    } of data) {
      this.startTimer();
      if (!articleCount)
        return this.printTimer(newsSource, `${ticker} [EMPTY]`, 0);

      const articlesWithHash = articles.map((article: any) =>
        this.genereateHashFromTitle(article, ticker, newsSource)
      );
      const hashList = articlesWithHash.map((article: any) => article.hash);
      const articlesAddedMsg = `ARTICLES ADDED ✅ => ${ticker}`;

      const { duplicates, count: duplicateCount } =
        await this.equestApi.getDuplicateNewsrecords(hashList);

      if (duplicateCount === articleCount)
        return this.printTimer(newsSource, articlesAddedMsg, 0);

      let newArticlesRecords = [];
      const hasDuplicates = duplicateCount > 0;
      const consoleMessage = hasDuplicates ? "DUPLICATES" : "NO DUPLICATES";

      if (duplicateCount === 0) {
        newArticlesRecords = articlesWithHash;
      } else if (hasDuplicates) {
        newArticlesRecords = articlesWithHash.filter(
          (article: any) => !duplicates.includes(article.hash)
        );
      }

      console.log(
        `🚀 ${newsSource} => ${consoleMessage} => ${ticker} => ${duplicateCount}`
      );
      this.newArticles = [...this.newArticles, ...newArticlesRecords];
      this.printTimer(newsSource, articlesAddedMsg, newArticlesRecords.length);
    }
  }

  genereateHashFromTitle(article: any, ticker: string, newsSource: string) {
    const { title = "" } = article;

    return {
      ...article,
      hash: this.encryptor.encrypt(title.replace(" ", "")),
      ticker,
      newsSource,
    };
  }

  async uploadNewsRecords() {
    this.startTimer();

    if (!this.newArticles.length)
      return this.printTimer("Total Articles", "UPLOADED", 0);

    const payload = {
      articles: this.newArticles,
      count: this.newArticles.length,
    };

    const { insertedCount = 0 } = await this.equestApi.uploadNewsRecords(
      payload
    );

    this.printTimer("Total Articles", "UPLOADED", insertedCount);
  }
}
