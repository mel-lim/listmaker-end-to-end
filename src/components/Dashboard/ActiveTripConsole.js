import React, { useState } from "react";
import { SettledTripName } from "./SettledTripName";
import { EditTripNameForm } from "./EditTripNameForm";

export const ActiveTripConsole = ({ activeTrip, setActiveTrip, lists, allListItems, saveListChanges, saveTripDetails, saveTripDetailsMessage, saveListsMessage, setTripDetailsHaveChangedSinceLastSave }) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleClickSave = event => {
        event.preventDefault();
        saveListChanges(); // This calls the savelists request to the server - the code can be found in Dashboard.js
        saveTripDetails(); // This calls the savetripdetails request to the server - the code can be found in Dashboard.js
    }

    return (
        <div className="active-trip-console">
            <div className="section-separator">*************</div>
            <div>
                <div>
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

                {lists.length && allListItems.length ?
                    <input type="button" value="Save changes" onClick={handleClickSave} />
                    :
                    null}

                <p>{saveTripDetailsMessage}</p>
                <p>{saveListsMessage}</p>

            </div>
        </div>
    );
}

