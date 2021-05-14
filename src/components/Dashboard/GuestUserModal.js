import React, { useContext } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DayJS from 'react-dayjs';

// Import contexts
import { UserContext, CookieExpiryContext } from "../../UserContext";

export const GuestUserModal = ({ openGuestUserModal, setOpenGuestUserModal }) => { // This is a component in Dashboard
    const { user } = useContext(UserContext);
    const { cookieExpiry } = useContext(CookieExpiryContext);

    return (
        <Popup open={openGuestUserModal} modal nested>
            {
                close => (
                    <div className="modal">

                        <div className="modal-header">You are logged in as guest user, '{user}'.</div> 
                        <div>Your guest user account will expire at <DayJS format="HH:mm on DD-MMMM-YYYY">{cookieExpiry}</DayJS>.</div>
                        <div className="modal-header">After this, any trips or lists you have saved will be deleted.</div>

                        <div className="actions">
                            <input type="button" className="modal-button" value="Close" onClick={close} />
                        </div>

                    </div>
                )
            }
        </Popup>
    );
}