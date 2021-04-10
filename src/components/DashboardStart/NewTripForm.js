import React, { useState } from "react";

export const NewTripForm = ({ setNewTripClicked, setActiveTrip }) => {

    // These states hold the values of the user inputs (radio buttons and text) until user submits the form
    const [tripName, setTripName] = useState('');
    const [tripCategory, setTripCategory] = useState('');
    const [tripDuration, setTripDuration] = useState('');

    const cancelTrip = () => {
        setNewTripClicked(false);
        setTripName('');
        setTripCategory('');
        setTripDuration('');
    }

    const createTrip = async (event) => {

        event.preventDefault();
        console.log("clicked");

        const requestBodyContent = { tripName, tripCategory, tripDuration };

        const response = await fetch('/trips/newtrip', {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(requestBodyContent)
        });

        const responseBodyText = await response.json();

        if (response.status === 201) {
            const newTrip = {
                tripId: responseBodyText.tripId,
                tripName: tripName,
                tripCategory: tripCategory,
                tripDuration: tripDuration,
            }
            setActiveTrip(newTrip); // This is going to get stored in localstorage
            setTripName(''); // These are ephemeral states and won't persist after refresh
            setTripCategory('');
            setTripDuration('');
        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        <section className="trip-questions">
            <h5 className="lighter-weight">Answer a couple of questions to populate your lists with some suggested items.</h5>

            <form onSubmit={createTrip}>
                <div className="trip-question">
                    <h5>Trip name</h5>
                    <input type="text" id="trip-name-input" name="trip-name" value={tripName} onChange={event => setTripName(event.target.value)} placeholder="e.g. Rainbow Mountain" />
                </div>

                <div className="trip-question">
                    <h5 className="lighter-weight">What sort of trip?</h5>
                    <div className="radio-button-label-div">
                        <input type="radio" id="ski-touring-radio" name="ski-touring-radio" value="ski-tour" className="radio-buttons" onClick={event => setTripCategory(event.target.value)} />
                        <label htmlFor="ski-touring-radio">Ski tour/splitboarding</label>
                    </div>
                </div>


                <div className="trip-question">
                    <h5 className="lighter-weight">Day trip or overnight trip?</h5>
                    <div className="radio-button-label-div">
                        <input type="radio" id="day-trip-radio" name="day-or-overnight-radio" value="day" className="radio-buttons" onClick={event => setTripDuration(event.target.value)} />
                        <label htmlFor="day-trip-radio">Day trip</label>
                    </div>
                    <div className="radio-button-label-div">
                        <input type="radio" id="overnight-trip-radio" name="day-or-overnight-radio" value="overnight"
                            className="radio-buttons" onClick={event => setTripDuration(event.target.value)} />
                        <label htmlFor="overnight-trip-radio">Overnight trip</label>
                    </div>
                </div>

                {tripCategory && tripDuration && (<input type="submit" value='Create trip' />)}

                <input type="button" value='Cancel trip' onClick={cancelTrip} />

            </form>

        </section>
    );
}

