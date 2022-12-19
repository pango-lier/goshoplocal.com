import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { COLUMNS, UserI } from './columns';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table } from 'reactstrap';
import Group from './sub';
import { getUsers } from 'api/users/getUsers';
import { notifyError } from 'utility/notify';

import IconTextPagination from './PaginationIconText';
const BaseTable = () => {
  const [data, setData] = useState<UserI[]>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(100);
  const [pageCount, setPageCount] = useState<number>(10);

  const onPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    fetchData({
      limit: perPage.toString(),
      offset: (selectedItem.selected * perPage).toString(),
    });
  };
  const fetchData = async (params: any) => {
    try {
      const response = await getUsers(params);
      setData(response.data[0]);
      setPageCount(response.data[1] / perPage);
    } catch (error) {
      notifyError(error);
    }
  };
  // useEffect(() => {
  //   fetchData({
  //     limit: perPage.toString(),
  //     offset: (currentPage * perPage).toString(),
  //   });
  // }, []);
  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns: useMemo(() => COLUMNS, []),
    state: {
      expanded,
    },
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div>
        <Table striped>
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      style: {
                        width: header.getSize(),
                        maxWidth: header.getSize(),
                        minWidth: header.getSize(),
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
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
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
                      <Group />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
          {/* <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot> */}
        </Table>
        <div className="h-4" />
        <IconTextPagination onPageChange={onPageChange} pageCount={pageCount} />
      </div>
    </>
  );
};
export default BaseTable;
