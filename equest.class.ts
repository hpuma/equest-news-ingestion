import Axios, { AxiosInstance } from "axios";
import * as env from "dotenv";

const envObject = env.config().parsed as any;
const { EQUEST_API_KEY } = envObject;
type Endpoint = {
  [key: string]: string;
};
export const endpoint: Endpoint = {
  alphav: "alphav/news",
  marketaux: "marketaux/news",
  news: "news/everything",
  newsRecord: "equest/news-record",
  newsRecordUpload: "equest/news-record/upload",
};

const endpointName: Endpoint = {
  alphav: "Alphav",
  marketaux: "Marketaux",
  news: "News",
};

export class EquestApi {
  private baseURL: string;
  private apiKey: string = EQUEST_API_KEY;
  private axiosInstance: AxiosInstance;
  private startTime: any;

  constructor() {
    console.log("EquestApi READY");
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

  // Search recprd by hash and upload records
  async getNewsRecordByHash(hash: string) {
    return await this.axiosInstance.get(`${endpoint.newsRecord}/${hash}`);
  }
  async uploadNewsRecords(newsRecords: any) {
    return await this.axiosInstance.post(
      `${endpoint.newsRecordUpload}/`,
      newsRecords
    );
  }

  // Use timer
  setTimer() {
    this.startTime = Date.now();
  }
  printTimer(source: string) {
    let timeTaken = Date.now() - this.startTime;
    console.log(`${source}: ${timeTaken} ms`);
  }

  // Get news
  async getNewsFromSource(source: string, ticker: string) {
    this.setTimer();
    const endpointPath = endpoint[source];
    const sourceName = endpointName[source];

    const { data } = await this.axiosInstance.get(endpointPath, {
      params: { ticker },
    });
    this.printTimer(sourceName);
    return data;
  }
}
