import { createColumnHelper } from "@tanstack/react-table";
import Action from "./Action";
import CheckboxTable from "./CheckboxTable";
import Tooltip from "./Tooltip";

export interface Crawler {
  checkbox?: any;
  id: string | number;
  change_level: string;
  change_type: string;
  from: string;
  to: string;
  date_and_time: any;
  actions?: any;
}

const columnHelper = createColumnHelper<Crawler>();

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
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        <>
          <CheckboxTable
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </>
      </div>
    ),
    size:70,
    maxSize:70
  }),
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    size:100,
    maxSize:100
  }),
  columnHelper.accessor((row) => row.change_level, {
    id: "change_level",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    size:100,
    maxSize:100
  }),
  columnHelper.accessor("change_type", {
    header: () => "change_type",
    cell: (info) => <Tooltip id={'c'+info.row.id} message={info.getValue()}/>,
    size:400,
    maxSize:400
  }),
  columnHelper.accessor("from", {
    header: () => <span>Visits</span>,
    size:200,
  }),
  columnHelper.accessor("to", {
    header: "to",
    size:200,
  }),
  columnHelper.accessor("date_and_time", {
    header: "date and time",
    size:200,
  }),
  {
    header: "Actions",
    cell: (info) => {
      return <Action />;
    },
    size:300,
  },
];
