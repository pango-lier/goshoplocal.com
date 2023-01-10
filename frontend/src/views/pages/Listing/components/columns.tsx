import { createColumnHelper } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, PlusCircle } from 'react-feather';
import { Tooltip } from 'views/pages/components/Tooltip';
import Action from './Action';
import CheckboxTable from './CheckboxTable';
import { IListing } from 'api/listings/type/interface';
import { ImageTooltip } from 'views/pages/components/ImageTooltip';

export interface IRow extends IListing {}
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
                {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
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
    columnHelper.accessor('etsy_listing_id', {
      cell: (info) => {
        let image: any = undefined;

        if (info.row.original.images) {
          const images = JSON.parse(info.row.original.images);
          if (images && images.length > 0) {
            image = images[0];
          }
        }

        return (
          <ImageTooltip
            id={'images' + info.row.id}
            message={info.row.original?.etsy_listing_id + ''}
            image={image?.url_75x75}
            imageTooltip={image?.url_570xN}
          />
        );
      },
      size: 10,
      minSize: 20,
      maxSize: 70,
    }),
    columnHelper.accessor('taxonomyb_name', {
      header: () => 'Category',
      cell: (info) => (
        <Tooltip
          id={'category' + info.row.id}
          message={info.row.original?.taxonomyb_name ?? ''}
        />
      ),
      size: 0,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('etsy_user_id', {
      header: () => 'Account Id',
      cell: (info) => (
        <Tooltip
          id={'etsy_user_id' + info.row.id}
          message={
            <span style={{ width: '100%', height: '100%' }}>
              <img
                style={{ width: 30 }}
                src={info.row.original?.account_image_url_75x75 + ''}
              />
              {info.row.original?.etsy_user_id + ''}
            </span>
          }
          fullMessage={'' + info.row.original?.etsy_user_id}
        />
      ),
      size: 10,
      minSize: 20,
      maxSize: 70,
    }),
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (info) => (
        <Tooltip
          id={'title' + info.row.id}
          message={info.row.original?.title ?? ''}
        />
      ),
      size: 0,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('description', {
      header: () => 'Description',
      cell: (info) => (
        <Tooltip
          id={'description' + info.row.id}
          message={info.row.original?.description ?? ''}
        />
      ),
      size: 0,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('price', {
      header: () => 'Price',
      cell: (info) => {
        if (!info.row.original.price) return '';
        const price = JSON.parse(info.row.original.price);
        if (!price.amount) return '';
        return (
          <Tooltip
            id={'price' + info.row.id}
            message={
              `${price.amount / price.divisor}${price.currency_code}` || ''
            }
          />
        );
      },
      size: 10,
      minSize: 50,
      maxSize: 200,
    }),
    columnHelper.accessor('state', {
      header: () => 'State',
      cell: (info) => (
        <Tooltip
          id={'scope' + info.row.id}
          message={info.row.original?.state ?? ''}
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
      size: 8,
      minSize: 50,
      maxSize: 150,
    }),
  ];
};
