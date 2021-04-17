import React, { useState, useEffect } from "react";

export const AllTripsDropdown = ({ updatedTripDetailsSaved, setUpdatedTripDetailsSaved, fetchLists, setActiveTrip, toggleRefreshAllTripDropdown }) => {

    const [allTrips, setAllTrips] = useState([]);
    const isMounted = true;

    useEffect(() => {
        if (isMounted) {
            fetchTrips();
            if (updatedTripDetailsSaved) {
                setUpdatedTripDetailsSaved(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatedTripDetailsSaved, toggleRefreshAllTripDropdown]);

    // FETCH ALL TRIPS FOR THIS USER
    const fetchTrips = async () => {
        const response = await fetch(`/trips/alltrips`, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        });

        const responseBodyText = await response.json();

        if (response.status === 200 || response.status === 304) {
            console.log(responseBodyText.trips);
            setAllTrips(responseBodyText.trips);
        } else {
            console.log(responseBodyText.message);
        }
    }

    const handleChange = event => {
        console.log(event.target.value);
        if (event.target.value === "select-trip") {
            return;
        } else {
            const selectedTripId = parseInt(event.target.value);

            const selectedTrip = allTrips.filter(trip => trip.id === selectedTripId)[0];

            console.log(selectedTrip);

            setActiveTrip({ tripId: selectedTripId, tripName: selectedTrip.name, tripCategory: selectedTrip.category, tripDuration: selectedTrip.duration });

            fetchLists(selectedTripId);
        }
    }

    return (

        <div className="trip-dropdown">
            <label htmlFor="trip-select">Load your lists:</label>
            <select name="trip" id="trip-select" onChange={handleChange}>
                <option value="select-trip">Select trip</option>
                {allTrips.map(trip => <option key={trip.id} value={trip.id}>{trip.name} / {trip.category} / {trip.duration}</option>)}
            </select>
        </div>


    );
}

