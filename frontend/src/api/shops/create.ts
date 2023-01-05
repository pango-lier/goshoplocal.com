import { hookApi } from "api/hookApi";
import axios from "axios";
import { CrawlerLinkEnum } from "./enum/crawler-link.enum";
export interface ICreateCrawlerLink {
  name: string;

  description?: string;

  status?: string;

  type?: CrawlerLinkEnum;

  target?: string;

  socialId?: number | string;

  accountId?: number | string;

  crawlerConfigs?: Array<any>;
}

export const createCrawlerLink = async (params: ICreateCrawlerLink) => {
  return await hookApi("post", `accounts`, {
    params,
    _success: true,
    title: "Create Shops",
  });
};
