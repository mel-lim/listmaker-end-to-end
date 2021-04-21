import React from 'react';
import Popup from 'reactjs-popup';

export const ConfirmDeleteListModal = () => {

    return (
        <Popup trigger={<button className="delete-button ui-button delete-list-button"></button>} modal nested>
            {
                close => (
                    <div className="confirm-delete-modal">
                        <div className="modal-header">Are you sure you want to delete this list?</div>
                        <div className="actions">
                            <input type="button" value="Delete it" />
                            <input type="button" value="Keep it" onClick={close} />
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}