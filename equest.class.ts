import Axios, { AxiosInstance } from "axios";
import * as env from "dotenv";

const { EQUEST_API_KEY } = env.config().parsed as any;
type Endpoint = {
  [key: string]: string;
};
export const endpoint: Endpoint = {
  alphav: "alphav/news",
  marketaux: "marketaux/news",
  news: "news/everything",
  newsRecord: "equest/news-record",
  newsRecordUpload: "equest/news-record/upload",
  tickerRecord: "equest/ticker-records",
};

export class EquestApi {
  private baseURL: string;
  private apiKey: string = EQUEST_API_KEY;
  private axiosInstance: AxiosInstance;
  private startTime: any;

  constructor() {
    console.log("✅ EquestApi READY");
    this.baseURL = "http://localhost:3001/";
    this.axiosInstance = Axios.create({
      baseURL: this.baseURL,
      headers: {
        common: {
          "x-api-key": this.apiKey,
        },
      },
    });
  }
  async getTickerRecords() {
    const endpointPath = endpoint["tickerRecord"];
    const { data } = await this.axiosInstance.get(endpointPath);
    return data;
  }

  // Get news
  async getNewsFromSource(endpointName: string, ticker: string) {
    const endpointPath = endpoint[endpointName];

    const { data } = await this.axiosInstance.get(endpointPath, {
      params: { ticker },
    });

    return data;
  }
  // Search record by hash and upload records
  async getNewsRecordByHash(hash: string) {
    return await this.axiosInstance.get(`${endpoint.newsRecord}/${hash}`);
  }

  async uploadNewsRecords(newsRecords: any) {
    return await this.axiosInstance.post(
      `${endpoint.newsRecordUpload}/`,
      newsRecords
    );
  }
}
