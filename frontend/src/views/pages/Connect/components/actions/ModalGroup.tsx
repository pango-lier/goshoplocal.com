import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ModalGroup = ({ isOpenModalGroup, setIsOpenModalGroup }) => {
    return (
        <div>
            <Modal isOpen={isOpenModalGroup} toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}>
                <ModalHeader toggle={() => setIsOpenModalGroup(!isOpenModalGroup)}>Basic Modal</ModalHeader>
                <ModalBody>
                    <h5>Check First Paragraph</h5>
                    Oat cake ice cream candy chocolate cake chocolate cake cotton candy dragée apple pie. Brownie carrot cake
                    candy canes bonbon fruitcake topping halvah. Cake sweet roll cake cheesecake cookie chocolate cake
                    liquorice.
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => setIsOpenModalGroup(!isOpenModalGroup)}>
                        Accept
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

//ModalGroup.propTypes = {};

export default ModalGroup;