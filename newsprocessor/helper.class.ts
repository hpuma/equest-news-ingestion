import { Encryptor } from "../utils/encryptor.class";

export class Helper {
  private encryptor: Encryptor;
  constructor(encryptionKey: string) {
    this.encryptor = new Encryptor(encryptionKey);
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

  removeDuplicatedRecords(
    articlesWithHash: any[],
    duplicates: any[],
    duplicateCount: number
  ) {
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
}
