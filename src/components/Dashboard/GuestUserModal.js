import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// Import contexts
import { UserContext } from "../../UserContext";


export const GuestUserModal = ({ openGuestUserModal, setOpenGuestUserModal }) => { // This is a component in Dashboard
    const { user } = useContext(UserContext);

    return (
        <Popup open={openGuestUserModal} modal nested>
            {
                close => (
                    <div className="modal">

                        <div className="modal-header">You are logged in as guest user, '{user}'. Your privileges as a guest user will last for 12 hours. After this, any trips or lists you have saved will be deleted.</div>

                        <div className="actions">
                            <input type="button" className="modal-button" value="Close" onClick={close} />
                        </div>

                    </div>
                )
            }
        </Popup>
    );
}