import React, { useState, useEffect } from "react";

export const AllTripsDropdown = ({ fetchLists, activeTrip, setActiveTrip, toggleRefreshAllTripsDropdown }) => {

    const [allTrips, setAllTrips] = useState([]);
    const isMounted = true;

    useEffect(() => {
        if (isMounted) {
            fetchTrips();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleRefreshAllTripsDropdown]);

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
            <div>
                <label htmlFor="trip-select">Load your lists from a saved trip:</label>
                <select name="trip" id="trip-select" onChange={handleChange} value={activeTrip.tripId ? activeTrip.tripId : "select-trip"}>
                    {allTrips.length ?
                        <option value="select-trip">Select trip</option> 
                        : <option value="no-saved-trips">No saved trips</option>
                    }
                    {allTrips.map(trip => <option key={trip.id} value={trip.id}>{trip.name} / {trip.category} / {trip.duration}</option>)}
                </select>

                <p>-- OR -- </p>
            </div>
        </div>


    );
}

