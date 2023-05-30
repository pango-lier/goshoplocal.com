import { createColumnHelper } from '@tanstack/react-table';
import { PlusCircle } from 'react-feather';
import { Tooltip } from 'views/pages/components/Tooltip';
import Action from './Action';
import CheckboxTable from './CheckboxTable';
import { IAccount } from 'api/shops/type/account.interface';

export interface IRow extends IAccount { }
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
      minSize: 5,
      maxSize: 15,
    }),
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
      size: 5,
      minSize: 5,
      maxSize: 15,
    }),
    columnHelper.accessor('etsy_user_id', {
      header: () => 'Account Id',
      // cell: (info) => info.getValue(),
      cell: (info) => (
        <Tooltip
          id={'etsy_user_id' + info.row.id}
          message={
            <span style={{ width: '100%', height: '100%' }}>
              <img
                style={{ width: 30 }}
                src={info.row.original.image_url_75x75}
              />
              {info.row.original?.etsy_user_id + ''}
            </span>
          }
          fullMessage={'' + info.row.original?.etsy_user_id}
        />
      ),
      size: 10,
      minSize: 8,
      maxSize: 25,
    }),
    columnHelper.accessor('vendor', {
      header: () => 'Vendor',
      cell: (info) => info.getValue(),
      size: 15,
      minSize: 30,
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
      size: 5,
      minSize: 5,
      maxSize: 20,
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
      minSize: 10,
      maxSize: 20,
    }),
    columnHelper.accessor('scope', {
      header: () => 'Scope',
      cell: (info) => (
        <Tooltip
          id={'scope' + info.row.id}
          message={info.row.original?.scope ?? ''}
        />
      ),
      size: 5,
      minSize: 5,
      maxSize: 15,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <Tooltip
          id={'status' + info.row.id}
          message={
            info.row.original?.active == true ? (
              <span className="text-success">active</span>
            ) : (
              <span className="text-danger">inActive</span>
            )
          }
        />
      ),
      size: 5,
      minSize: 5,
      maxSize: 10,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      size: 5,
      minSize: 5,
      maxSize: 15,
      cell: (info) => {
        const date = new Date(info.row.original.createdAt + '');
        return (
          <Tooltip
            id={'createdAt' + info.row.id}
            fullMessage={info.row.original.createdAt + ''}
            message={`${date.getMonth() + 1
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
      size: 5,
      minSize: 5,
      maxSize: 15,
    }),
  ];
};
