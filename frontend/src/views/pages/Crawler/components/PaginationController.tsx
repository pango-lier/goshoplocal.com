import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Crawler } from "./columns";

const PaginationController = (table: Table<Crawler>) => {
  return (
    <>
      <Pagination
        className="d-flex justify-content-center align-items-center mt-1"
        listClassName="pagination-success"
      >
        <PaginationItem className="cen">
          <div>{table.getRowModel().rows.length} Rows</div>
        </PaginationItem>
        <PaginationItem className="align-items-center">
          <span className="d-flex justify-content-around  align-items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </PaginationItem>
        <PaginationItem>
          <span className="d-flex justify-content-around  align-items-center gap-1">
            <Input
              bsSize="sm"
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
            />
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            first
          >
            <i
              className="fa-solid fa-angles-left"
              style={{ fontSize: "15px" }}
            ></i>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            first
          >
            <i className="fa-solid fa-angle-left"></i>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            last
          >
            <i className="fa-solid fa-angle-right"></i>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            last
          >
            <i
              className="fa-solid fa-angles-right"
              style={{ fontSize: "15px" }}
            ></i>
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </>
  );
};
export default PaginationController;
