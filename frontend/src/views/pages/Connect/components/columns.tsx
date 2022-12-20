import { createColumnHelper } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronRight,
  ChevronsDown,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  PlusCircle,
} from 'react-feather';
import Action from './Action';
import CheckboxTable from './CheckboxTable';
import { Tooltip } from '../../components/Tooltip';
import { IConnect } from './interface/connect.interface';

const columnHelper = createColumnHelper<IConnect>();

export const COLUMNS = (
  onCreateHandle: Function,
  onEditHandle: Function,
  onDeleteHandle: Function,
) => [
  columnHelper.accessor((row) => row.checkbox, {
    id: 'checkbox',
    header: ({ table }) => (
      <>
        <CheckboxTable
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
        {''}
        {/* <span
          {...{
            style: { cursor: "pointer" },
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          {table.getIsAllRowsExpanded() ? <ChevronsDown /> : <ChevronsRight />}
        </span> */}
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
          {''}
          {row.getCanExpand() ? (
            <span
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
            >
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
            </span>
          ) : (
            ''
          )}
        </>
      </div>
    ),
    size: 15,
    minSize: 10,
    maxSize: 15,
  }),
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    size: 15,
    minSize: 10,
    maxSize: 20,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Name</span>,
    size: 50,
    minSize: 20,
    maxSize: 50,
  }),
  columnHelper.accessor('name', {
    header: () => 'name',
    cell: (info) => (
      <Tooltip id={'c' + info.row.id} message={info.getValue() ?? ''} />
    ),
    size: 40,
    minSize: 40,
    maxSize: 50,
  }),
  columnHelper.accessor('status', {
    header: () => 'status',
    cell: (info) => (
      <Tooltip id={'c' + info.row.id} message={info.getValue() ?? ''} />
    ),
    size: 40,
    minSize: 40,
    maxSize: 50,
  }),
  columnHelper.accessor('accessToken', {
    header: () => <span>Email</span>,
    size: 50,
    minSize: 50,
    maxSize: 50,
  }),
  columnHelper.accessor('active', {
    header: 'active',
    size: 40,
    minSize: 40,
    maxSize: 40,
  }),
  columnHelper.accessor('expiredAt', {
    header: 'expired',
    size: 50,
    minSize: 50,
    maxSize: 50,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date',
    size: 50,
    minSize: 50,
    maxSize: 50,
  }),
  columnHelper.accessor('actions', {
    header: ({ table }) => (
      <>
        <PlusCircle
          className="cursor-pointer"
          onClick={() => onCreateHandle()}
          size="30px"
        />
      </>
    ),
    cell: (info) => {
      return (
        <Action
          row={info.row.original}
          onEditHandle={onEditHandle}
          onDeleteHandle={onDeleteHandle}
        />
      );
    },
    size: 30,
    minSize: 30,
    maxSize: 40,
  }),
];
