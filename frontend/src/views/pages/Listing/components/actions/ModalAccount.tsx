import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { ACTION_ENUM } from 'utility/enum/actions';

import { IRow } from '../columns';
import { deleteListing } from 'api/listings/delete';

interface IModalIAccountProps<T> {
  row: T | undefined;
  isOpenModalGroup: boolean;
  setIsOpenModalGroup: Function;
  onHandleModal: Function;
  action: ACTION_ENUM;
}
const ModalAccount = ({
  isOpenModalGroup,
  setIsOpenModalGroup,
  row,
  onHandleModal,
  action,
}: IModalIAccountProps<IRow>) => {
  const [styleAction, setStyleAction] = useState<
    React.CSSProperties | undefined
  >();
  const [data, setData] = useState<IRow>();

  useEffect(() => {
    if (action === ACTION_ENUM.Delete)
      setStyleAction({ pointerEvents: 'none', opacity: '0.7' });
  }, [action]);

  useEffect(() => {
    setData(row);
  }, [row]);

  const onAccept: React.FormEventHandler<HTMLButtonElement> = async (
    e: React.FormEvent<HTMLButtonElement>,
  ) => {
    switch (action) {
      case ACTION_ENUM.Create:
        setIsOpenModalGroup(!isOpenModalGroup);
        //  onHandleModal(account.data);
        break;
      case ACTION_ENUM.Edit:
        setIsOpenModalGroup(!isOpenModalGroup);

        break;
      case ACTION_ENUM.Delete:
        if (data && data.id) {
          await deleteListing(+data.id);
          onHandleModal(data);
        }
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <Modal
        isOpen={isOpenModalGroup}
        toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}
      >
        <ModalHeader toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}>
          {action === ACTION_ENUM.Delete
            ? 'Are you sure delete this shop ?'
            : 'Update shop'}
        </ModalHeader>
        <ModalBody>
          <Form className="auth-register-form mt-2" style={styleAction}></Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => onAccept(e)}>
            Accept
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

//ModalGroup.propTypes = {};

export default ModalAccount;
