import React from "react";
import BaseTable from "./components/BaseTable";
import { IConnect } from "../interface/connect.interface";

interface Props {
  user: IConnect;
}
const Group = ({ user }: Props) => {
  return (
    <div>
      <BaseTable user={user} />
    </div>
  );
};

export default Group;
