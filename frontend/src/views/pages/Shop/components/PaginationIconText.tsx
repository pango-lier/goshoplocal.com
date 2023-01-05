// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

// ** Third Party Components
import ReactPaginate from "react-paginate";

const Previous = () => {
  return <span className="align-middle d-none d-md-inline-block">Prev</span>;
};

const Next = () => {
  return <span className="align-middle d-none d-md-inline-block">Next </span>;
};

interface IconTextPaginationProps {
  onPageChange: (selectedItem: { selected: number }) => void;
  pageCount: number;
  initialPage?: number;
}

const IconTextPagination = ({
  onPageChange,
  pageCount,
}: IconTextPaginationProps) => {
  return (
    <div className="mt-2 mr-5">
      <ReactPaginate
        initialPage={0}
        pageCount={pageCount}
        breakLabel="..."
        nextLabel={<Next />}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        activeClassName="active"
        pageClassName="page-item"
        breakClassName="page-item"
        previousLabel={<Previous />}
        onPageChange={onPageChange}
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        nextClassName="page-item next"
        breakLinkClassName="page-link"
        previousClassName="page-item prev"
        previousLinkClassName="page-link"
        containerClassName="pagination react-paginate justify-content-end"
      />
    </div>
  );
};
export default IconTextPagination;
