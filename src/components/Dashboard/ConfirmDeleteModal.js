import React, { useState } from 'react';
import Popup from 'reactjs-popup';

export const ConfirmDeleteModal = ({ activeTrip, setTripDeleted, toggleRefreshAllTripDropdown, setToggleRefreshAllTripDropdown }) => {

    const [deleteSuccessful, setDeleteSuccessful] = useState(false);

    const deleteTrip = async () => {

        const tripId = activeTrip.tripId;

        // If the trip name is blank / empty
        if (!tripId || !tripId.length) {
            //setSaveTripDetailsMessage("Unable to save edited trip name: trip name can't be blank");
        }

        console.log("delete request starting");

        const response = await fetch(`/trips/${tripId}/deletetrip`, {
            method: 'DELETE',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        if (response.status === 204) {
            console.log("response status is 204");
            setDeleteSuccessful(true);
            setToggleRefreshAllTripDropdown(!toggleRefreshAllTripDropdown); // This will trigger the hook to re-fetch the all trips data and re-populate the drop down list with the updated trip name */
        }
    }

    return (
        <Popup trigger={<input type="button" value="Delete trip" />} modal nested>
            {
                close => (
                    <div className="confirm-delete-modal">

                        {!deleteSuccessful ?
                            <div className="modal-header">Are you sure you want to delete this trip?</div> :
                            <div className="modal-header">This trip has been deleted</div>
                        }

                        {!deleteSuccessful ?
                            <div className="actions">
                                <input type="button" value="Delete forever" onClick={deleteTrip} />
                                <input type="button" value="Keep for now" onClick={close} />
                            </div> :
                            <div className="actions">
                                <input
                                    type="button"
                                    value="Close"
                                    onClick={() => {
                                        close();
                                        setDeleteSuccessful(false);
                                    }} />
                            </div>}
                    </div>
                )
            }
        </Popup>
    );
}