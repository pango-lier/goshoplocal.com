import { createColumnHelper } from '@tanstack/react-table';
import { PlusCircle } from 'react-feather';
import { Tooltip } from 'views/pages/components/Tooltip';
import Action from './Action';
import CheckboxTable from './CheckboxTable';
import { IAaccount } from 'api/shops/type/account.interface';

export interface IRow extends IAaccount {}
interface ITable extends IRow {
  checkbox?: any;
  expanded?: any;
  actions?: any;
}
const columnHelper = createColumnHelper<ITable>();

export const COLUMNS = (
  onCreateHandle: Function,
  onEditHandle: Function,
  onDeleteHandle: Function,
) => {
  return [
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
                  style: { cursor: 'pointer' },
                  onClick: row.getToggleExpandedHandler(),
                }}
              >
                {/* {row.getIsExpanded() ? <ChevronsUp /> : <ChevronsDown />} */}
              </span>
            ) : (
              ''
            )}
          </>
        </div>
      ),
      size: 5,
      minSize: 40,
      maxSize: 100,
    }),
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
      size: 5,
      minSize: 20,
      maxSize: 70,
    }),
    columnHelper.accessor('etsy_user_id', {
      header: () => 'Account Id',
      cell: (info) => info.getValue(),
      size: 10,
      minSize: 20,
      maxSize: 70,
    }),
    columnHelper.accessor('vendor', {
      header: () => 'Vendor',
      cell: (info) => info.getValue(),
      size: 10,
      minSize: 20,
      maxSize: 70,
    }),
    columnHelper.accessor('primary_email', {
      header: () => 'Email',
      cell: (info) => (
        <Tooltip
          id={'primary_email' + info.row.id}
          message={info.row.original?.primary_email ?? ''}
        />
      ),
      size: 0,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => (
        <Tooltip
          id={'name' + info.row.id}
          message={info.row.original?.name ?? ''}
        />
      ),
      size: 10,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('scope', {
      header: () => 'Scope',
      cell: (info) => (
        <Tooltip
          id={'scope' + info.row.id}
          message={info.row.original?.scope ?? ''}
        />
      ),
      size: 8,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <Tooltip
          id={'status' + info.row.id}
          message={info.row.original?.status ?? ''}
        />
      ),
      size: 10,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      size: 7,
      minSize: 40,
      maxSize: 100,
      cell: (info) => {
        const date = new Date(info.row.original.createdAt + '');
        return (
          <Tooltip
            id={'createdAt' + info.row.id}
            fullMessage={info.row.original.createdAt + ''}
            message={`${
              date.getMonth() + 1
            }/${date.getDate()}/${date.getFullYear()}`}
          />
        );
      },
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
      size: 15,
      minSize: 50,
      maxSize: 150,
    }),
  ];
};
