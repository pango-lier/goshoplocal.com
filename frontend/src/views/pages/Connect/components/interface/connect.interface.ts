export interface IConnect {
  checkbox?: any;
  expanded?: any;
  id: string;
  name: string;
  ip: string;
  accessToken: string;
  status: string;
  active: boolean;
  createdAt: Date;
  expiredAt: Date;
  actions?: any;
}

export interface IUserProps {
  user: IConnect;
}
