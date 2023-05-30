import React from 'react';
import { getListingCsv } from 'api/listings/getCsv';
import { Edit, MoreVertical, Navigation, Trash } from 'react-feather';
import { CSVLink } from 'react-csv';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import useStateWithPromise from 'utility/helper/useStateWithPromise';

const Action = ({ row, onEditHandle, onDeleteHandle }: any) => {
  const csvRef = React.useRef<any>();
  const [csvData, setCsvData] = useStateWithPromise([]);
  const [header, setHeader] = useStateWithPromise();
  const onGetListingCsv = async (row) => {
    const response = await getListingCsv(row.id);
    if (response?.data?.fullCsv) {
      await setCsvData(response.data.fullCsv);
      await setHeader(
        response.data.headerCsv.map((i) => {
          return {
            label: i.label,
            key: i.value,
          };
        }),
      );
      csvRef.current.link.click();
    }
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
            {/* <DropdownItem href="#" onClick={() => onGetListingCsv(row)}>
              <Edit className="me-50" size={15} />{' '}
              <span className="align-middle">Csv File</span>
            </DropdownItem> */}
            <DropdownItem href="#" onClick={() => onDeleteHandle(row)}>
              <Trash className="me-50" size={15} />{' '}
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
          <CSVLink
            data={csvData}
            headers={header}
            filename={'listing_' + row.etsy_user_id + '.csv'}
            className="hidden"
            ref={csvRef}
            target="_blank"
            separator={'\t'}
          />
        </UncontrolledDropdown>
      </div>
    </>
  );
};

export default Action;
