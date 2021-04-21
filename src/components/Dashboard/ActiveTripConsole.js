import React, { useState } from "react";
import { SettledTripName } from "./SettledTripName";
import { EditTripNameForm } from "./EditTripNameForm";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

export const ActiveTripConsole = ({ activeTrip, setActiveTrip, lists, allListItems, fetchLists, saveListChanges, saveTripDetails, saveTripDetailsMessage, saveListsMessage, setTripDetailsHaveChangedSinceLastSave, toggleRefreshAllTripsDropdown, setToggleRefreshAllTripsDropdown, resetOnDelete, addNewList }) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleClickSave = event => {
        event.preventDefault();
        saveListChanges(); // This calls the savelists request to the server - the code can be found in Dashboard.js
        saveTripDetails(); // This calls the savetripdetails request to the server - the code can be found in Dashboard.js
    }

    const handleClickRevert = event => {
        event.preventDefault();
        fetchLists(activeTrip.tripId);
    }

    return (
        <div className="active-trip-console">
            <hr></hr>
            <div>
                <div>
                    <p>Active trip console</p>
                    {!isEditing ?
                        <SettledTripName
                            activeTrip={activeTrip}
                            toggleEdit={toggleEdit} />
                        : <EditTripNameForm
                            activeTrip={activeTrip}
                            setActiveTrip={setActiveTrip}
                            toggleEdit={toggleEdit}
                            setTripDetailsHaveChangedSinceLastSave={setTripDetailsHaveChangedSinceLastSave} />
                    }
                </div>
                <h6 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h6>
                <h6 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h6>
            </div>

            <div className="save-button-container">
                <ConfirmDeleteModal
                    activeTrip={activeTrip}
                    toggleRefreshAllTripsDropdown={toggleRefreshAllTripsDropdown}
                    setToggleRefreshAllTripsDropdown={setToggleRefreshAllTripsDropdown}
                    resetOnDelete={resetOnDelete} />
                <input type="button" value="Add new list" onClick={addNewList} />

                {lists.length && allListItems.length ?
                    <div>
                        <input type="button" value="Revert to last save" onClick={handleClickRevert} />
                        <input type="button" value="Save changes" onClick={handleClickSave} />
                    </div>
                    :
                    null}

                <p>{saveTripDetailsMessage}</p>
                <p>{saveListsMessage}</p>

            </div>
        </div>
    );
}

