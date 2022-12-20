import { Edit, MoreVertical, Trash } from "react-feather";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const Action = (row: any) => {

  return (
    <>
      <div className="d-flex justify-content-around align-content-between flex-nowrap">
        <Button
          size="sm"
          color="primary"
          className="btn-icon ml-1"
          onClick={(e) => e.preventDefault()}
        >
          {" "}
          <i className="fa-solid fa-pen" style={{ fontSize: 12 }} />
        </Button>
        <Button
          size="sm"
          color="primary"
          className="btn-icon ml-1"
          onClick={(e) => e.preventDefault()}
        >
          {" "}
          <i className="fa-solid fa-pen" style={{ fontSize: 12 }} />
        </Button>
        <Button
          size="sm"
          color="primary"
          className="btn-icon ml-1"
          onClick={(e) => e.preventDefault()}
        >
          {" "}
          <i className="fa-solid fa-pen" style={{ fontSize: 12 }} />
        </Button>
        <UncontrolledDropdown>
          <DropdownToggle
            className="icon-btn hide-arrow"
            color="transparent"
            size="sm"
            caret
          >
            <MoreVertical size={15} />
          </DropdownToggle>
          <DropdownMenu container={"body"}>
            <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
              <Edit className="me-50" size={15} />{" "}
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem href="/" onClick={(e) => e.preventDefault()}>
              <Trash className="me-50" size={15} />{" "}
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </>
  );
};

export default Action;
