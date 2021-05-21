import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { deleteTripApi } from '../../api';

export const ConfirmDeleteTripModal = ({ activeTrip, fetchTrips, resetTripAndListStates, setProgressMessage, setIsLoading }) => { // This is a component in ActiveTripConsole

    const [modalErrorMessage, setModalErrorMessage] = useState(null);

    const deleteTrip = async (retryCount = 0) => {
        setIsLoading(true);
        const tripId = activeTrip.tripId;

        try {
            const response = await deleteTripApi(tripId);
            setProgressMessage("");

            if (response.ok === true) {
                console.log("trip deleted");
                fetchTrips();
                resetTripAndListStates(); // Call function to reset the activeTrip and lists etc. states to their initial render value (i.e. empty/clear) - this will remove the active trip console and lists from showing the just-deleted trip info
                setModalErrorMessage(null);

            } else {
                setModalErrorMessage('The trip cannot be deleted at this moment.');
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in deleteTrip function. Cannot connect to server");
            setIsLoading(false);
            setModalErrorMessage('The trip cannot be deleted at this moment. Please check your internet connection or try again later.');
        }
    }

    return (
        <Popup trigger={<input type="button" className="pillbox-button" value="Delete trip" title="delete trip" />} modal nested>
            {
                !modalErrorMessage ?
                    close => (
                        <div className="confirm-delete-modal">
                            <div className="modal-header">Are you sure you want to delete this trip?</div>
                            <div className="actions">
                                <input type="button" value="Delete forever" onClick={deleteTrip} />
                                <input type="button" value="Keep for now" onClick={close} />
                            </div>
                        </div>
                    )
                    :
                    close => (
                        <div className="confirm-delete-modal">
                            <div className="modal-header">{modalErrorMessage}</div>
                            <div className="actions">
                                <input type="button" value="Close" onClick={close} />
                            </div>
                        </div>
                    )
            }
        </Popup>
    );
}