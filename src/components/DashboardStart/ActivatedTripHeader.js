import React from "react";

export const ActivatedTripHeader = ({ activeTrip, generateLists }) => {

    const handleClick = event => {
        event.preventDefault();
        console.log("clicked");
        generateLists();
    }

    return (
        <div>
            <h5>Trip name: {activeTrip.tripName}</h5>
            <input type="button" value="Generate lists" onClick={handleClick} />
        </div>
    );
}

