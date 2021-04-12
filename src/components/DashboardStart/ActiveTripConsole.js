import React from "react";

export const ActiveTripConsole = ({ activeTrip, lists, allListItems, saveChanges, saveAttemptMessage, fetchLists }) => {

    const handleClickSave = event => {
        event.preventDefault();
        saveChanges(); // This posts data to the server - the code can be found in Dashboard.js
    }

    const handleClickFetch = event => {
        event.preventDefault();
        fetchLists(activeTrip.tripId); // This posts data to the server - the code can be found in Dashboard.js
    }

    return (
        <div className="active-trip-console">
        <div className="section-separator">*************</div>
            <div>
                <h5>Trip name: {activeTrip.tripName}</h5>
                <h6 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h6>
                <h6 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h6>
            </div>

            <div className="save-button-container">

                {lists.length && allListItems.length ?
                    (<div className="save-fetch-button-container">
                        <div>
                            <input type="button" value="Save changes" onClick={handleClickSave} />
                        </div>
                        <div>
                            <input type="button" value="Fetch data (temp)" onClick={handleClickFetch} />
                        </div>
                    </div>) :
                    null}

                <p>{saveAttemptMessage}</p>

            </div>

        </div>

    );
}

