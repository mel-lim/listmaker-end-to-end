import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// Import contexts
import { GuestUserContext, OpenConfirmCredentialsModalContext } from "../../UserContext";

import { ValidateCredentials } from "../Login/ValidateCredentials"

export const ConfirmCredentialsModal = () => { // This is a component in Dashboard
    const { isGuestUser } = useContext(GuestUserContext);
    const { openConfirmCredentialsModal, setOpenConfirmCredentialsModal } = useContext(OpenConfirmCredentialsModalContext);

    return (
        <Popup open={openConfirmCredentialsModal} modal nested>
            {
                !isGuestUser ?
                    close => (
                        <div className="modal">

                            <div className="header">Your token has expired. Please confirm your login details to keep using the app or you will automatically be logged out.</div>

                            <div className="content">
                                <ValidateCredentials context={"confirmCredentials"} setOpenConfirmCredentialsModal={setOpenConfirmCredentialsModal} />
                            </div>

                        </div>
                    )
                    : close => (
                        <div className="modal">

                            <div className="modal-header">Your guest user session is about to expire.</div>

                            <div className="actions">
                                <input type="button" className="modal-button" value="Close" onClick={close} />
                            </div>

                        </div>
                    )
            }
        </Popup>
    );
}