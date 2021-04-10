import React from "react";
import { NewTripForm } from './NewTripForm';
import { ActivatedTripHeader } from './ActivatedTripHeader';

export const DashboardHeader = ({ setNewTrip, activeTrip, setActiveTrip, lists, allListItems, generateLists, saveChanges, saveAttemptMessage }) => {

    return (
        <div>
            {!activeTrip.tripId ?

                <NewTripForm 
                    setNewTrip={setNewTrip} 
                    setActiveTrip={setActiveTrip} /> :

                <ActivatedTripHeader 
                    activeTrip={activeTrip} 
                    lists={lists} 
                    allListItems={allListItems}
                    generateLists={generateLists} 
                    saveChanges={saveChanges}
                    saveAttemptMessage={saveAttemptMessage} />
            }
        </div>
    );
}

