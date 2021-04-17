import React from 'react';
import Popup from 'reactjs-popup';

export const ConfirmDeleteModal = () => {

    return (
        <Popup trigger={<input type="button" value="Delete trip" />} modal nested>
            {
                close => (
                    <div className="confirm-delete-modal">

                        <div className="modal-header">Are you sure you want to delete this trip?</div>

                        <div className="actions">
                            <input type="button" value="Delete forever" />
                            <input type="button" value="Keep for now" onClick={close} />
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}