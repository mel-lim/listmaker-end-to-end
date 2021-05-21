import React, { useState } from "react";

export const EditTripNameForm = ({ activeTrip, setActiveTrip, toggleEdit, editTripDetails }) => { // This is a component in ActiveTripConsole

    const [editedTripName, setEditedTripName] = useState(activeTrip.tripName);

    const handleSubmit = event => {
        event.preventDefault(); 
        toggleEdit(); // This will show the trip name in its 'settled' or fixed appearance, rather than as an input box
        if (editedTripName !== activeTrip.tripName) {
            editTripDetails(editedTripName); // This calls the editTripDetails function - see Dashboard.js
        }
    }

    return (
        <div className="edit-trip-name-container">
            <form onSubmit={handleSubmit} >
                <input type="text" value={editedTripName} onChange={event => setEditedTripName(event.target.value)} />
                <input type="submit" className="done-button ui-button" value='' />
            </form>
        </div>
    );
}