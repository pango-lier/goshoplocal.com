import { CrawlerLinkEnum } from "./enum/crawler-link.enum";
import { hookApi } from "api/hookApi";

export interface IUpdateCrawlerLink {
  name: string;

  description?: string;

  status?: string;

  type?: CrawlerLinkEnum;

  target?: string;

  socialId?: number | string;

  accountId?: number | string;

  deletedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;

  crawlerConfigs?: Array<any>;
}

export const updateCrawlerLink = async (
  id: number,
  params: IUpdateCrawlerLink
) => {
  return await hookApi("patch", `accounts/${id}`, {
    params,
    _success: true,
    title: "Create Crawler Link",
  });
};
