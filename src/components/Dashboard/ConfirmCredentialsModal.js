import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { ValidateCredentials } from "../Login/ValidateCredentials"

export const ConfirmCredentialsModal = ({ openConfirmCredentialsModal, setOpenConfirmCredentialsModal }) => {

    const context = "confirmCredentials";

    return (
        <Popup open={openConfirmCredentialsModal} modal nested>
            {
                close => (
                    <div className="modal">

                        <div className="header">Your token has expired. Please confirm your login details to keep using the app or you will automatically be logged out.</div>

                        <div className="content">
                            <ValidateCredentials context={context} setOpenConfirmCredentialsModal={setOpenConfirmCredentialsModal} />
                        </div>

                    </div>
                )
            }
        </Popup>
    );
}