import Axios, { AxiosInstance } from "axios";
import { config } from "./utils/config";

const { EQUEST_API_KEY } = config;
type Endpoint = {
  [key: string]: string;
};
export const endpoint: Endpoint = {
  alphav: "alphav/news",
  marketaux: "marketaux/news",
  news: "news/everything",
  bing: "bing/news",
  newsdata: "newsdata/news",
  gnews: "gnews/news",
  thenews: "thenews/news",
  newsRecord: "equest/news-record",
  newsRecordUpload: "equest/news-record/upload",
  newsRecordDuplicates: "equest/news-record/duplicates",
  tickerRecord: "equest/ticker-records",
};

export class EquestApi {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseURL = "http://localhost:3001/";
    this.axiosInstance = Axios.create({
      baseURL: this.baseURL,
      headers: {
        common: {
          "x-api-key": EQUEST_API_KEY,
        },
      },
    });
    console.log("✅ EquestApi READY");
  }
  async getTickerRecords() {
    const endpointPath = endpoint["tickerRecord"];
    const { data } = await this.axiosInstance.get(endpointPath);
    return data;
  }

  // Get news
  async getNewsFromSource(source: string, ticker: string) {
    const endpointPath = endpoint[source];

    const { data } = await this.axiosInstance.get(endpointPath, {
      params: { ticker },
    });
    return data;
  }
  // Search record by hash and upload records
  async getDuplicateNewsrecords(hashes: string[]) {
    const requestBody = { hashes };
    const { data } = await this.axiosInstance.post(
      endpoint.newsRecordDuplicates,
      requestBody
    );
    return data;
  }

  async uploadNewsRecords(newsRecords: any) {
    const { data } = await this.axiosInstance.post(
      endpoint.newsRecordUpload,
      newsRecords
    );
    return data;
  }
}
