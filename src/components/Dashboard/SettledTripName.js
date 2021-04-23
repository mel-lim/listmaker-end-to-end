import React from "react";

export const SettledTripName = ({ activeTrip, toggleEdit }) => {

    return (
        <div className="trip-name-container">
            <h4>Trip name: {activeTrip.tripName}</h4>
            <button className="edit-button ui-button" onClick={toggleEdit}></button>
        </div>
    );
}