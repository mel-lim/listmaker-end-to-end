import React from "react";
import { NewTripForm } from './NewTripForm';
import { ActivatedTripHeader } from './ActivatedTripHeader';

export const DashboardHeader = ({ setNewTrip, activeTrip, setActiveTrip, generateLists, lists, allListItems }) => {

    return (
        <div>
            {!activeTrip.tripId ?

                <NewTripForm setNewTrip={setNewTrip} setActiveTrip={setActiveTrip} /> :

                <ActivatedTripHeader activeTrip={activeTrip} generateLists={generateLists} lists={lists} allListItems={allListItems} />
            }
        </div>
    );
}

