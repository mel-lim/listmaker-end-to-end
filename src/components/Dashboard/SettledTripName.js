import React from "react";

export const SettledTripName = ({ activeTrip, toggleEdit }) => {

    return (
        <div className="trip-name-container">
            <h5>Trip name: {activeTrip.tripName}</h5>
            <button className="edit-button ui-button" onClick={toggleEdit}></button>
        </div>
    );
}