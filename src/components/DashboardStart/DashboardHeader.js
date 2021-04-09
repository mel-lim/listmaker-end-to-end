import React from "react";
import { NewTripForm } from './NewTripForm';
import { ActivatedTripHeader } from './ActivatedTripHeader';

export const DashboardHeader = ({ setNewTrip, activeTrip, setActiveTrip, setLists }) => {

    return (
        <div>
            {!activeTrip.tripId ?

                <NewTripForm setNewTrip={setNewTrip} setActiveTrip={setActiveTrip} /> :

                <ActivatedTripHeader activeTrip={activeTrip} setLists={setLists} />
            }
        </div>
    );
}

