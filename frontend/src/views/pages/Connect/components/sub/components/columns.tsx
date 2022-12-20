import { createColumnHelper } from "@tanstack/react-table";
import { ChevronsDown, ChevronsUp } from "react-feather";
import { Button } from "reactstrap";
import { Tooltip } from "views/pages/components/Tooltip";
import Action from "./Action";
import CheckboxTable from "./CheckboxTable";

export enum GroupEnum {
  NONE = "none",
  GOLOGIN = "Gologin",
}

export interface SubUserGroupI {
  checkbox?: any;
  expanded?: any;
  id: string | number;
  name: string;
  groupType: GroupEnum;
  secrectName?: string;
  secrectKey?: string;
  createdAt: Date;
  actions?: any;
}

const columnHelper = createColumnHelper<SubUserGroupI>();

export const COLUMNS = [
  columnHelper.accessor((row) => row.checkbox, {
    id: "checkbox",
    header: ({ table }) => (
      <>
        <CheckboxTable
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </>
    ),
    cell: ({ row, getValue }) => (
      <div
        style={
          {
            // Since rows are flattened by default,
            // we can use the row.depth property
            // and paddingLeft to visually indicate the depth
            // of the row
            // paddingLeft: `${row.depth * 2}rem`,
          }
        }
      >
        <>
          <CheckboxTable
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
          {""}
          {row.getCanExpand() ? (
            <span
              {...{
                style: { cursor: "pointer" },
                onClick: row.getToggleExpandedHandler(),
              }}
            >
              {row.getIsExpanded() ? <ChevronsUp /> : <ChevronsDown />}
            </span>
          ) : (
            ""
          )}
        </>
      </div>
    ),
    size: 30,
    maxSize: 50,
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    size: 20,
    maxSize: 20,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Name</span>,
    size: 100,
    maxSize: 100,
  }),
  columnHelper.accessor("secrectName", {
    header: () => "Secrect Name",
    cell: (info) => (
      <Tooltip id={"c" + info.row.id} message={info.getValue() ?? ""} />
    ),
    size: 100,
    maxSize: 100,
  }),
  columnHelper.accessor("secrectKey", {
    header: () => <span>Secrect Key</span>,
    size: 100,
    maxSize: 200,
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    size: 100,
  }),
  {
    header: "Actions",
    cell: (info) => {
      return <Action row={info.row.original} />;
    },
    size: 150,
  },
];
