export interface ISorted {
  id: string;
  desc: boolean;
}
export interface IFiltered {
  id: string;
  desc: boolean;
}
export interface IPaginate {
  pageIndex?: number | string;
  pageSize?: number | string;
  limit: number;
  offset: number;
  sorted?: ISorted[] | undefined;
  filtered?: IFiltered[] | undefined;
  q?: number | string | undefined;
}
