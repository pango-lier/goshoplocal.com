
import { hookApi } from "api/hookApi";
import { IAccount, IUpdateAccount } from "./type/account.interface";



export const updateAccount= async (
  id: number,
  params: IUpdateAccount
) => {
  return await hookApi("patch", `accounts/${id}`, {
    params,
    _success: true,
    title: "Update Shops",
  });
};
