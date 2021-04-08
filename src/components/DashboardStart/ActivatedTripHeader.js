import React from "react";

export const ActivatedTripHeader = ({ activeTrip }) => {

    return (
        <div>
            <h5>{activeTrip.tripName}</h5>
        </div>
    );
}

