import Axios, { AxiosInstance } from "axios";
import * as env from "dotenv";

const envObject = env.config().parsed as any;
const { EQUEST_API_KEY } = envObject;

const endpoint = {
  newsRecord: "news-record",
  newsRecordUpload: "news-record/upload",
};

export class EquestApi {
  private baseURL: string;
  private apiKey: string = EQUEST_API_KEY;
  private axiosInstance: AxiosInstance;

  constructor() {
    console.log("EQUEST API READY");
    this.baseURL = "http://localhost:3001/equest/";
    this.axiosInstance = Axios.create({
      baseURL: this.baseURL,
      headers: {
        common: {
          "x-api-key": this.apiKey,
        },
      },
    });
  }

  async findNewsRecordByHash(hash: string) {
    const recordsFound = this.axiosInstance.get(
      `${endpoint.newsRecord}/${hash}`
    );
    return recordsFound;
  }
  async uploadNewsRecords(newsRecords: any) {
    const uploadedRecords = this.axiosInstance.post(
      `${endpoint.newsRecordUpload}/`,
      newsRecords
    );
    return uploadedRecords;
  }
}
