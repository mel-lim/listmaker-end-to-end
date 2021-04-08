import React from "react";
import { NewTripForm } from './NewTripForm';
import { ActivatedTripHeader } from './ActivatedTripHeader';

export const DashboardHeader = ({ setNewTrip, activeTrip, setActiveTrip }) => {

    

    return (
        <div>
            {!activeTrip.tripId ?

                <NewTripForm setNewTrip={setNewTrip} setActiveTrip={setActiveTrip} /> :

                <ActivatedTripHeader activeTrip={activeTrip} />
            }
        </div>
    );
}

