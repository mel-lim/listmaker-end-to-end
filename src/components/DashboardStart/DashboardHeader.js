import React from "react";
import { NewTripForm } from './NewTripForm';
import { ActivatedTripHeader } from './ActivatedTripHeader';

export const DashboardHeader = ({ setNewTrip, activeTrip, setActiveTrip, generateLists }) => {

    return (
        <div>
            {!activeTrip.tripId ?

                <NewTripForm setNewTrip={setNewTrip} setActiveTrip={setActiveTrip} /> :

                <ActivatedTripHeader activeTrip={activeTrip} generateLists={generateLists} />
            }
        </div>
    );
}

