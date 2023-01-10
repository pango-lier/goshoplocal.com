import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { COLUMNS, IRow } from './columns';
import {
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Card, CardBody, CardHeader, Input, Table } from 'reactstrap';
import IconTextPagination from './PaginationIconText';
import { ACTION_ENUM } from 'utility/enum/actions';

import ModalAccount from './actions/ModalAccount';
import { Search } from 'react-feather';
import { getAccount } from 'api/shops/gets';

const BaseTable = () => {
  const [isOpenModalGroup, setIsOpenModalGroup] = useState<boolean>(false);
  const [row, setRow] = useState<IRow | undefined>();
  const [data, setData] = useState<IRow[]>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(100);
  const [total, setTotal] = useState<number>(0);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.None);

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
    } else if (action === ACTION_ENUM.Edit) {
      const _data = data.map((i) => {
        if (i.id === row.id) i = row;
        return i;
      });
      setData(_data);
    } else if (action === ACTION_ENUM.Delete) {
      let _data = data.filter((i) => i.id !== row.id);
      setData(_data);
    }
    setIsOpenModalGroup(false);
  };

  const onPageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
    fetchData({
      limit: perPage,
      offset: selectedItem.selected * perPage,
    });
  };

  const fetchData = async ({ limit, offset }) => {
    const response = await getAccount({
      limit,
      offset,
      sorted: [{ id: 'account.id', desc: true }],
    });
    setData(response.data.result);
    setTotal(response.data.total);
  };
  useEffect(() => {
    // fetchData();
  }, []);

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns: useMemo(
      () => COLUMNS(onCreateHandle, onEditHandle, onDeleteHandle),
      [],
    ),
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
      <Card className="table-card">
        <CardHeader>
          <div className="d-flex" data-tour="search">
            <label
              className="border-0 bg-transparent cursor-pointer me-0"
              htmlFor="searchInput"
            >
              <Search color="primary" size={14} />
            </label>
            <Input
              id="searchInput"
              type="search"
              className="border-0 shadow-none bg-transparent"
              placeholder="Search..."
              // onChange={handleSearch}
              // value={searchInput}
            />
          </div>
          <>Action</>
        </CardHeader>
        <CardBody className="table-responsive">
          <Table>
            <thead className="table-dark">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="rt-th"
                      {...{
                        key: header.id,
                        style: {
                          width:
                            header.column.columnDef.size !== 0
                              ? `${header.column.columnDef.size}%`
                              : 'auto',
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
            <tbody className="rt-tbody">
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr className="table-default">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        className="rt-td"
                        {...{
                          key: cell.id,
                          style: {
                            width:
                              cell.column.columnDef.size !== 0
                                ? `${cell.column.columnDef.size}%`
                                : 'auto',
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
                </Fragment>
              ))}
            </tbody>
          </Table>
          <div className="h-4" />
          <div className="paginate-relative">
            <IconTextPagination
              onPageChange={onPageChange}
              pageCount={total / perPage}
            />
          </div>
        </CardBody>
        {isOpenModalGroup && (
          <ModalAccount
            row={row}
            onHandleModal={onHandleModal}
            action={action}
            isOpenModalGroup={isOpenModalGroup}
            setIsOpenModalGroup={(value) => setIsOpenModalGroup(value)}
          />
        )}
      </Card>
    </>
  );
};
export default BaseTable;
