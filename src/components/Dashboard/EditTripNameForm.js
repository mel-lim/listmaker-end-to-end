import React, { useState } from "react";

export const EditTripNameForm = ({ activeTrip, setActiveTrip, toggleEdit, setTripDetailsHaveChangedSinceLastSave }) => {

    const [editedTripName, setEditedTripName] = useState(activeTrip.tripName);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEdit();
        if (editedTripName !== activeTrip.tripName) {
            setActiveTrip({...activeTrip, tripName: editedTripName});
            setTripDetailsHaveChangedSinceLastSave(true);
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