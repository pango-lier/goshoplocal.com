import { createColumnHelper } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
} from "react-feather";
import { Button } from "reactstrap";
import Action from "./Action";
import CheckboxTable from "./CheckboxTable";
import { Tooltip } from "../../components/Tooltip";

export interface UserI {
  checkbox?: any;
  expanded?: any;
  id: string | number;
  name: string;
  email: string;
  username: string;
  active: boolean;
  rolesId: number;
  createdAt: Date;
  actions?: any;
}

const columnHelper = createColumnHelper<UserI>();

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
        {""}
        <span
          {...{
            style: { cursor: "pointer" },
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? <ChevronsDown /> : <ChevronsRight />}
        </span>
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
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: "pointer" },
              }}
            >
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
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
  columnHelper.accessor("username", {
    header: () => "username",
    cell: (info) => (
      <Tooltip id={"c" + info.row.id} message={info.getValue() ?? ""} />
    ),
    size: 100,
    maxSize: 100,
  }),
  columnHelper.accessor("email", {
    header: () => <span>Email</span>,
    size: 100,
    maxSize: 200,
  }),
  columnHelper.accessor("active", {
    header: "active",
    size: 100,
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
