import { Edit, MoreVertical, Trash } from 'react-feather';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import { ButtonTooltip } from 'views/pages/components/ButtonTooltip';
import { IConnect } from './interface/connect.interface';

import { Link, useHistory } from 'react-router-dom';

const Action = ({
  row,
  onEditHandle,
  onDeleteHandle,
}: {
  row: IConnect;
  onEditHandle: Function;
  onDeleteHandle: Function;
}) => {
  const history = useHistory();
  const onConnect = (row: IConnect) => {
    window.open(`/connects/${row.accessToken}/oauth2`, "_blank");
  };
  return (
    <>
      <div className="d-flex justify-content-around align-content-between flex-nowrap">
        <ButtonTooltip
          color="success"
          id={'create-account' + row.id}
          message={'Create new account'}
          onHandle={() => onConnect(row)}
          icon={<>Connect</>}
        />
        <ButtonTooltip
          color="success"
          id={'create-account' + row.id}
          message={'Create new account'}
          onHandle={() => onEditHandle(row)}
          icon={<i className="fa-solid fa-pen" style={{ fontSize: 12 }} />}
        />
        <ButtonTooltip
          id={'create-account' + row.id}
          message={'Create new account'}
          onHandle={() => onDeleteHandle(row)}
          icon={<i className="fa-solid fa-pen" style={{ fontSize: 12 }} />}
          color="danger"
        />
        <UncontrolledDropdown>
          <DropdownToggle
            className="icon-btn hide-arrow"
            color="transparent"
            size="sm"
            caret
          >
            <MoreVertical size={15} />
          </DropdownToggle>
          <DropdownMenu container={'body'}>
            <DropdownItem href="/" onClick={(e) => onEditHandle(row)}>
              <Edit className="me-50" size={15} />{' '}
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem href="/" onClick={(e) => onDeleteHandle(row)}>
              <Trash className="me-50" size={15} />{' '}
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    </>
  );
};

export default Action;
