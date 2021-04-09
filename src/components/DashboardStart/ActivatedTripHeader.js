import React from "react";

export const ActivatedTripHeader = ({ activeTrip, generateLists, lists, allListItems }) => {

    const handleClick = event => {
        event.preventDefault();
        generateLists(); // This fetches data from server using a get request - the code can be found in Dashboard.js
    }

    return (
        <div>
            <h5>Trip name: {activeTrip.tripName}</h5>
            <h6 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h6>
            <h6 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h6>
            {!lists.length && !allListItems.length &&
                <input type="button" value="Generate lists" onClick={handleClick} />}
        </div>
    );
}

