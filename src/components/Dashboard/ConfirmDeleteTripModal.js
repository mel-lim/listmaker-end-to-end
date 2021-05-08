import React from 'react';
import Popup from 'reactjs-popup';
import { deleteTripApi } from '../../api';

export const ConfirmDeleteTripModal = ({ activeTrip, fetchTrips, resetTripAndListStates }) => { // This is a component in ActiveTripConsole

    const deleteTrip = async () => {
        const tripId = activeTrip.tripId;

        try {
            const response = await deleteTripApi(tripId);

            if (response.status === 204) {
                console.log("trip deleted");
                fetchTrips();
                resetTripAndListStates(); // Call function to reset the activeTrip and lists etc. states to their initial render value (i.e. empty/clear) - this will remove the active trip console and lists from showing the just-deleted trip info
            }
            
        } catch {
            console.error("Error in deleteTrip function. Cannot connect to server");
        }
    }

    return (
        <Popup trigger={<input type="button" className="pillbox-button" value="Delete trip" />} modal nested>
            {
                close => (
                    <div className="confirm-delete-modal">
                        <div className="modal-header">Are you sure you want to delete this trip?</div>
                        <div className="actions">
                            <input type="button" value="Delete forever" onClick={deleteTrip} />
                            <input type="button" value="Keep for now" onClick={close} />
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}