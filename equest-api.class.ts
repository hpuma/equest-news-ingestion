import Axios, { AxiosInstance } from "axios";
import * as env from "dotenv";

const envObject = env.config().parsed as any;
const { EQUEST_API_KEY } = envObject;

const endpoint = {
  newsRecord: "equest/news-record",
  newsRecordUpload: "equest/news-record/upload",
  newsEverything: "news/everything",
  alphavNews: "alphav/news",
  marketauxNews: "marketaux/news",
};

export class EquestApi {
  private baseURL: string;
  private apiKey: string = EQUEST_API_KEY;
  private axiosInstance: AxiosInstance;

  constructor() {
    console.log("EQUEST API READY");
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
  async getNewsRecordByHash(hash: string) {
    return await this.axiosInstance.get(`${endpoint.newsRecord}/${hash}`);
  }
  async uploadNewsRecords(newsRecords: any) {
    return await this.axiosInstance.post(
      `${endpoint.newsRecordUpload}/`,
      newsRecords
    );
  }

  // News Endpoints
  async getAlphavNews(ticker: string) {
    return await this.axiosInstance.get(`${endpoint.alphavNews}/`, {
      params: { ticker },
    });
  }
  async getMarketauxNews(ticker: string) {
    return await this.axiosInstance.get(`${endpoint.marketauxNews}/`, {
      params: { ticker },
    });
  }
  async getNewsEverything(ticker: string) {
    return await this.axiosInstance.get(`${endpoint.newsEverything}/`, {
      params: { ticker },
    });
  }
}
