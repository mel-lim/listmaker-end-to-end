import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { ValidateCredentials } from "../Login/ValidateCredentials"

export const ConfirmCredentialsModal = ({ openModal, setOpenModal }) => {

    const context = "confirmCredentials";

    const closeModal = () => setOpenModal(false);

    return (
        <Popup open={openModal} modal nested>
            {
                close => (
                    <div className="modal">

                        <button className="close" onClick={closeModal}>&times;</button>

                        <div className="header">Your token has expired. Please confirm your login details to keep using the app or you will automatically be logged out.</div>

                        <div className="content">
                            <ValidateCredentials context={context} setOpenModal={setOpenModal} />
                        </div>

                        <div className="actions">
                            <button className="button" onClick={close} >
                                close modal
                            </button>
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}