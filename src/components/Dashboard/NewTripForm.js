import React, { useState } from "react";

export const NewTripForm = ({ newTripClicked, setNewTripClicked, setIsFetchProcessing, toggleRefreshAllTripsDropdown, setToggleRefreshAllTripsDropdown, setActiveTrip, configureLists, setNewTripNeedsSaving }) => {

    // Dynamic user inputs for the form
    const [tripName, setTripName] = useState('');
    const [tripCategory, setTripCategory] = useState('');
    const [tripDuration, setTripDuration] = useState('');
    const [requestTemplate, setRequestTemplate] = useState('');

    const [submissionErrorMessage, setSubmissionErrorMessage] = useState('');

    // CANCEL FORM
    const cancelTrip = () => {
        setNewTripClicked(false);
        setTripName('');
        setTripCategory('');
        setTripDuration('');
    }

    // CREATE NEW TRIP AND GENERATE NEW LISTS
    const createTrip = async () => {

        if (!tripCategory || !tripDuration || !requestTemplate) {
            setSubmissionErrorMessage('** Please select a response for all questions **');
            return;
        }

        setIsFetchProcessing(true);

        const requestBodyContent = { tripName, tripCategory, tripDuration, requestTemplate };

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

        // Update the states that govern render-logic
        setNewTripClicked(false);
        setToggleRefreshAllTripsDropdown(!toggleRefreshAllTripsDropdown);

        if (response.status === 201) {
            const newTrip = {
                tripId: responseBodyText.tripId,
                tripName: tripName,
                tripCategory: tripCategory,
                tripDuration: tripDuration,
                requestTemplate: requestTemplate
            }

            // Activates a trip - this will display the trip details in the active trip console
            setActiveTrip(newTrip); // This is going to get stored in localstorage

            // Sets the states that govern the lists rendered
            // Function is declared in Dashboard.js
            configureLists(responseBodyText.lists, responseBodyText.allListItems);

            // Reset the local states that records the values inputted by the user into the new trip form
            setTripName('');
            setTripCategory('');
            setTripDuration('');
            setSubmissionErrorMessage('');

            // Call for the newly generated lists and items to be saved
            setNewTripNeedsSaving(true);

        } else {
            console.log(responseBodyText.message);
        }
    }

    const handleSubmit = event => {
        event.preventDefault();
        createTrip();
    }

    return (
        <section className="new-trip-form">
            <p className="inline-text">Make new lists:</p>
                {
                    !newTripClicked ?

                        <input type="button" value='Create new trip' onClick={() => setNewTripClicked(true)} /> :

                        <input type="button" value='Cancel new trip' onClick={cancelTrip} />
                }
            {
                newTripClicked ?

                    <div>
                        <h5 className="lighter-weight">Answer a couple of questions to populate your lists with some suggested items.</h5>

                        <form onSubmit={handleSubmit}>

                            <div className="trip-question">
                                <h5>Trip name</h5>
                                <input type="text" id="trip-name-input" name="trip-name" value={tripName} onChange={event => setTripName(event.target.value)} placeholder="e.g. Rainbow Mountain" required />
                            </div>

                            <div className="trip-question">
                                <h5 className="lighter-weight">What sort of trip?</h5>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="ski-touring-radio" name="ski-touring-radio" value="ski tour" className="radio-buttons" onClick={event => setTripCategory(event.target.value)} />
                                    <label htmlFor="ski-touring-radio">Ski tour/splitboarding</label>
                                </div>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="summer-mountaineering-radio" name="summer-mountaineering-radio" value="summer mountaineering" className="radio-buttons" onClick={event => setTripCategory(event.target.value)} />
                                    <label htmlFor="summer-mountaineering-radio">Summer mountaineering</label>
                                </div>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="hiking-radio" name="hiking-radio" value="hiking" className="radio-buttons" onClick={event => setTripCategory(event.target.value)} />
                                    <label htmlFor="hiking-radio">Hiking</label>
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

                            <div className="trip-question">
                                <h5 className="lighter-weight">Generate lists with suggested list items?</h5>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="request-template-radio-true" name="request-template" value="yes" className="radio-buttons" onClick={event => setRequestTemplate(event.target.value)} />
                                    <label htmlFor="request-template-radio-true">Yes</label>
                                </div>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="request-template-radio-false" name="request-template" value="no"
                                        className="radio-buttons" onClick={event => setRequestTemplate(event.target.value)} />
                                    <label htmlFor="request-template-radio-false">No</label>
                                </div>
                            </div>

                            <input type="submit" value='Create trip' />
                            <p>{submissionErrorMessage}</p>
                        </form>
                    </div>

                    : null
            }
        </section>
    );
}

