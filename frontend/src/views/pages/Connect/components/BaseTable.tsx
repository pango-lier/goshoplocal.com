import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { COLUMNS } from './columns';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table } from 'reactstrap';
import Group from './sub';
import ModalGroup from './actions/ModalUser';
import { getConnects } from 'api/connects/getConnects';
import { notifyError } from 'utility/notify';
import IconTextPagination from 'views/pages/User/components/PaginationIconText';
import { ACTION_ENUM } from 'utility/enum/actions';
import { IConnect } from './interface/connect.interface';
const BaseTable = () => {
  const [isOpenModalGroup, setIsOpenModalGroup] = useState<boolean>(false);
  const [row, setRow] = useState<IConnect | undefined>();
  const [data, setData] = useState<IConnect[]>([]);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.None);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(10);
  const onCreateHandle = () => {
    setAction(ACTION_ENUM.Create);
    setRow(undefined);
    setIsOpenModalGroup(true);
  };

  const onEditHandle = (row) => {
    setRow(row);
    setAction(ACTION_ENUM.Edit);
    setIsOpenModalGroup(true);
  };
  const onDeleteHandle = (row) => {
    setRow(row);
    setAction(ACTION_ENUM.Delete);
    setIsOpenModalGroup(true);
  };
  const onHandleModal = (row) => {
    if (action === ACTION_ENUM.Create) {
      const _data = [...data];
      _data.unshift(row);
      setData(_data);
    }
    setIsOpenModalGroup(false);
  };

  const onPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    fetchData({
      limit: perPage.toString(),
      offset: (selectedItem.selected * perPage).toString(),
    });
  };
  const fetchData = async (params: any) => {
    try {
      const response = await getConnects(params);
      setData(response.data[0]);
      setPageCount(response.data[1] / perPage);
    } catch (error) {
      notifyError(error);
    }
  };

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns: useMemo(
      () => COLUMNS(onCreateHandle, onEditHandle, onDeleteHandle),
      [],
    ),
    state: {
      expanded,
    },
    getRowCanExpand: () => false,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });
  const rerender = React.useReducer(() => ({}), {})[1];
  return (
    <>
      <div>
        <Table>
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      style: {
                        width: header.column.columnDef.size,
                        maxWidth: header.column.columnDef.maxSize,
                        minWidth: header.column.columnDef.minSize,
                      },
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr className="table-default">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      {...{
                        key: cell.id,
                        style: {
                          width: cell.column.columnDef.size,
                          maxWidth: cell.column.columnDef.maxSize,
                          minWidth: cell.column.columnDef.minSize,
                        },
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>
                      <Group user={row.original} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </Table>
        <div className="h-4" />
        <IconTextPagination onPageChange={onPageChange} pageCount={pageCount} />
      </div>
      {isOpenModalGroup && (
        <ModalGroup
          action={action}
          row={row}
          isOpenModalGroup={isOpenModalGroup}
          setIsOpenModalGroup={(value) => setIsOpenModalGroup(value)}
          onHandleModal={onHandleModal}
        />
      )}
    </>
  );
};
export default BaseTable;
