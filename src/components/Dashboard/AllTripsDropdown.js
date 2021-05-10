import React from "react";

export const AllTripsDropdown = ({ allTrips, activeTrip, setActiveTrip, resetTripAndListStates, fetchLists, connectionErrorMessage }) => {

    const handleChange = event => {
        if (event.target.value === "select-trip") {
            resetTripAndListStates();

        } else {
            const selectedTripId = parseInt(event.target.value);

            const selectedTrip = allTrips.filter(trip => trip.id === selectedTripId)[0];

            setActiveTrip({ tripId: selectedTripId, tripName: selectedTrip.name, tripCategory: selectedTrip.category, tripDuration: selectedTrip.duration });

            fetchLists(selectedTripId);
        }
    }

    return (

        <div className="trip-dropdown">
            <div>

                <label htmlFor="trip-select"
                    className="bolder">Load your lists from a saved trip:</label>

                <select name="trip"
                    id="trip-select"
                    onChange={handleChange}
                    value={activeTrip.tripId ? activeTrip.tripId : "select-trip"}>

                    {
                        allTrips.length ?

                            <option value="select-trip"
                                disabled={connectionErrorMessage}>
                                Select trip
                            </option>

                            : <option value="no-saved-trips">No saved trips</option>
                    }

                    {
                        allTrips.map(
                            trip =>
                                <option key={trip.id}
                                    value={trip.id}
                                    disabled={connectionErrorMessage}>
                                    {trip.name} / {trip.category} / {trip.duration}
                                </option>
                        )
                    }

                </select>
            </div>
        </div>
    );
}

