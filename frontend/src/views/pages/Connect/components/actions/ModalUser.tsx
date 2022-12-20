import React, { useState } from 'react';
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
import { notifyError, notifySuccess } from 'utility/notify';
import { ACTION_ENUM } from 'utility/enum/actions';
import { IConnect } from '../interface/connect.interface';
import { createConnect } from 'api/connects/createConnect';

interface IModalGroupProps {
  row: IConnect | undefined;
  isOpenModalGroup: boolean;
  setIsOpenModalGroup: Function;
  onHandleModal: Function;
  action: ACTION_ENUM;
}
const ModalGroup = ({
  isOpenModalGroup,
  setIsOpenModalGroup,
  row,
  action,
  onHandleModal,
}: IModalGroupProps) => {
  const [name, setName] = useState<string>('');

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e?.target) {
      setName(e.target.value);
    }
  };

  const onChangeGroupType = (e) => {
    if (e) {
      //  setGroupType(e.value);
    }
  };
  const create: React.FormEventHandler<HTMLButtonElement> = async (
    e: React.FormEvent<HTMLButtonElement>,
  ) => {
    try {
      switch (action) {
        case ACTION_ENUM.Create:
          const data = await createConnect({
            name,
          });
          setIsOpenModalGroup(!isOpenModalGroup);
          onHandleModal(data.data);

          break;

        default:
          break;
      }
    } catch (error) {
      notifyError(error);
    }
  };
  return (
    <div>
      <Modal
        isOpen={isOpenModalGroup}
        toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}
      >
        <ModalHeader toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}>
          Basic Modal
        </ModalHeader>
        <ModalBody>
          <Form className="auth-register-form mt-2">
            <div className="mb-1">
              <Label className="form-label" for="register-name">
                Name
              </Label>
              <Input
                type="text"
                id="register-name"
                placeholder="johndoe"
                autoFocus
                onChange={(e) => onChangeName(e)}
              />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => create(e)}>
            Accept
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

//ModalGroup.propTypes = {};

export default ModalGroup;
