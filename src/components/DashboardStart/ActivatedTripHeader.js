import React from "react";

export const ActivatedTripHeader = ({ activeTrip, setLists }) => {

    const generateLists = async (event) => {
        event.preventDefault();
        console.log("clicked");

        const response = await fetch(`/trips/generatenewlists/${activeTrip.tripId}?requestTemplate=true`, {
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

        if (response.status === 200) {
            setLists(responseBodyText.lists);
            console.log(responseBodyText.lists);
        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        <div>
            <h5>Trip name: {activeTrip.tripName}</h5>
            <input type="button" value="Generate lists" onClick={generateLists} />
        </div>
    );
}

