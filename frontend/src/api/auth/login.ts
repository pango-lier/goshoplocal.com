import axios from "axios";

export interface ILogin {
  password: string;
  email?: string;
  username?: string;
}
export const login = async (login: ILogin) => {
  if (!process.env.REACT_APP_SERVER_URL)
    throw Error("REACT_APP_SERVER_URL is not founded .");
  return await axios.post(process.env.REACT_APP_SERVER_URL, login);
};
