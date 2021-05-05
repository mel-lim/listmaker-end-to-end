import React, { useState } from "react";
import { SettledTripName } from "./SettledTripName";
import { EditTripNameForm } from "./EditTripNameForm";
import { ConfirmDeleteTripModal } from "./ConfirmDeleteTripModal";

export const ActiveTripConsole = ({ activeTrip, setActiveTrip, lists, allListItems, fetchLists, saveListChanges, editTripDetails, saveTripDetailsMessage, saveListsMessage, toggleRefreshAllTripsDropdown, setToggleRefreshAllTripsDropdown, resetOnDelete, addNewList }) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleClickSave = event => {
        event.preventDefault();
        saveListChanges(); // This calls the savelists request to the server - the code can be found in Dashboard.js
        /* editTripDetails(); // This calls the savetripdetails request to the server - the code can be found in Dashboard.js */
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
                    <p className="bolder">Active trip console</p>
                    {
                        !isEditing ?
                            <SettledTripName
                                activeTrip={activeTrip}
                                toggleEdit={toggleEdit} />
                            : <EditTripNameForm
                                activeTrip={activeTrip}
                                setActiveTrip={setActiveTrip}
                                toggleEdit={toggleEdit}
                                editTripDetails={editTripDetails}
                                 />
                    }
                </div>

                <h5 className="lighter-weight">Trip category: {activeTrip.tripCategory}</h5>

                <h5 className="lighter-weight">Trip duration: {activeTrip.tripDuration}</h5>
            </div>

            <div className="save-button-container">
                <ConfirmDeleteTripModal
                    activeTrip={activeTrip}
                    toggleRefreshAllTripsDropdown={toggleRefreshAllTripsDropdown}
                    setToggleRefreshAllTripsDropdown={setToggleRefreshAllTripsDropdown}
                    resetOnDelete={resetOnDelete} />
                <input type="button"
                    className="pillbox-button"
                    value="New list" onClick={addNewList} />

                {lists.length && allListItems.length ?
                    <div>
                        <input type="button"
                            className="pillbox-button"
                            value="Revert"
                            onClick={handleClickRevert} />

                        <input type="button"
                            className="pillbox-button"
                            value="Save"
                            onClick={handleClickSave} />
                    </div>
                    :
                    null}

                <p>{saveTripDetailsMessage}</p>
                <p>{saveListsMessage}</p>

            </div>
        </div>
    );
}

