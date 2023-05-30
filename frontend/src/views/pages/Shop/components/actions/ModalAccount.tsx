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
import { updateAccount } from 'api/shops/update';
import { deleteAccount } from 'api/shops/delete';

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

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>, name) => {
    if (e && e?.target) {
      const _d: any = { ...data };
      if (name === 'active') {
        setData({ ..._d, active: !data?.active });
      } else setData({ ..._d, [name]: e.target.value });
    }
  };

  useEffect(() => {
    setData(row);
  }, [row]);

  const onAccept: React.FormEventHandler<HTMLButtonElement> = async (
    e: React.FormEvent<HTMLButtonElement>,
  ) => {
    switch (action) {
      case ACTION_ENUM.Create:
        if (!data?.name) return;
        setIsOpenModalGroup(!isOpenModalGroup);
        //  onHandleModal(account.data);
        break;
      case ACTION_ENUM.Edit:
        if (data) {
          const { id, ...rest } = data;
          const update = await updateAccount(data.id, rest);
          onHandleModal(update.data);
        }
        //  setIsOpenModalGroup(!isOpenModalGroup);

        break;
      case ACTION_ENUM.Delete:
        if (data) {
          await deleteAccount(data.id);
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
          {action===ACTION_ENUM.Delete?"Are you sure delete this shop ?":"Update shop"}
        </ModalHeader>
        <ModalBody>
          <Form className="auth-register-form mt-2" style={styleAction}>
            <div className="mb-2">
              <Label className="form-label" for="register-vendor">
                Vendor
              </Label>
              <Input
                value={data?.vendor || ''}
                type="text"
                id="register-vendor"
                placeholder="vendor"
                autoFocus
                onChange={(e) => onChangeName(e, 'vendor')}
              />
            </div>
            <div className="mb-1">
              <Label className="form-label mr-5" for="register-vendor">
                Active Shop :
              </Label>
              {'      '}
              <Input
                className="ml-5"
                checked={data?.active}
                type="switch"
                id="register-vendor"
                placeholder="vendor"
                autoFocus
                onChange={(e) => onChangeName(e, 'active')}
              />
            </div>
          </Form>
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
