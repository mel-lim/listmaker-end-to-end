import React from "react";

export const ActivatedTripHeader = ({ activeTrip, lists, allListItems, generateLists, saveChanges, saveAttemptMessage, fetchLists }) => {

    const handleClickGenerate = event => {
        event.preventDefault();
        generateLists(); // This fetches data from server using a get request - the code can be found in Dashboard.js
    }

    const handleClickSave = event => {
        event.preventDefault();
        saveChanges(); // This posts data to the server - the code can be found in Dashboard.js
    }

    const handleClickFetch = event => {
        event.preventDefault();
        fetchLists(); // This posts data to the server - the code can be found in Dashboard.js
    }

    return (
        <div className="activated-trip-header">
            <div>
                <h5>Trip name: {activeTrip.tripName}</h5>
                <h6 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h6>
                <h6 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h6>
            </div>

            <div className="generate-save-button-container">

                {!lists.length && !allListItems.length ?
                    <input type="button" value="Generate lists" onClick={handleClickGenerate} /> :
                    null}

                {lists.length && allListItems.length ?
                    (<div>
                        <input type="button" value="Save changes" onClick={handleClickSave} />
                        <input type="button" value="Fetch data (temp)" onClick={handleClickFetch} />
                    </div>) :
                    null}

                <p>{saveAttemptMessage}</p>

            </div>

        </div>

    );
}

