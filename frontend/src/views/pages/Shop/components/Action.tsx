import { syncAccount } from 'api/etsy/account/syncAccount';
import { syncListing } from 'api/etsy/account/syncListing';
import { Edit, MoreVertical, Navigation, Trash } from 'react-feather';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';

const Action = ({ row, onEditHandle, onDeleteHandle }: any) => {
  const syncAccountHandle = async (row) => {
    const account = await syncAccount(row.etsy_user_id);
  };
  const syncListingHandle = async (row) => {
    const account = await syncListing(row.etsy_user_id);
  };
  
  return (
    <>
      <div className="d-flex justify-content-around align-content-between flex-nowrap">
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
            <DropdownItem href="#" onClick={() => syncAccountHandle(row)}>
              <Edit className="me-50" size={15} />{' '}
              <span className="align-middle">Sync Account</span>
            </DropdownItem>
            <DropdownItem href="#" onClick={() => syncListingHandle(row)}>
              <Edit className="me-50" size={15} />{' '}
              <span className="align-middle">Sync Listing</span>
            </DropdownItem>
            
            <DropdownItem href="#" onClick={() => onEditHandle(row)}>
              <Edit className="me-50" size={15} />{' '}
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem href="#" onClick={() => onDeleteHandle(row)}>
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
