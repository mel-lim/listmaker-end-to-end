import React from 'react';
import Popup from 'reactjs-popup';

export const ConfirmDeleteListModal = ({ list, deleteList }) => {

    return (
        <Popup trigger={<button className="delete-button ui-button delete-list-button"></button>} modal nested>
            {
                close => (
                    <div className="confirm-delete-modal">
                        <div className="modal-header">Are you sure you want to delete the entire "{list.title}" list?</div>
                        <div className="actions">
                            <input type="button" value="Delete forever" onClick={deleteList} />
                            <input type="button" value="Keep it" onClick={close} />
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}