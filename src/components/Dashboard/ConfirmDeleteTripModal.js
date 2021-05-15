import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { delay, deleteTripApi } from '../../api';

// Import config data
import configData from "../../config.json";

export const ConfirmDeleteTripModal = ({ activeTrip, fetchTrips, resetTripAndListStates, setConnectionErrorMessage }) => { // This is a component in ActiveTripConsole

    const [modalErrorMessage, setModalErrorMessage] = useState(null);

    const deleteTrip = async (retryCount = 0) => {
        const tripId = activeTrip.tripId;

        try {
            const response = await deleteTripApi(tripId);
            setConnectionErrorMessage(null);

            if (response.status === 204) {
                console.log("trip deleted");
                fetchTrips();
                resetTripAndListStates(); // Call function to reset the activeTrip and lists etc. states to their initial render value (i.e. empty/clear) - this will remove the active trip console and lists from showing the just-deleted trip info
                setModalErrorMessage(null);
            } else {
                setModalErrorMessage('The trip cannot be deleted at this moment.');
            }

        } catch {
            console.error("Error in deleteTrip function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setConnectionErrorMessage(`The server not responding. Trying again... ${retryCount}/${parseInt(configData.MAX_RETRY_COUNT) - 1}`);
                await delay(retryCount); // Exponential backoff - see api.js
                return deleteTrip(retryCount + 1); // After the delay, try connecting again
            }

            setConnectionErrorMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
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