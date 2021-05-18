import React, { useState } from "react";
import { delay, createTripApi } from "../../api";

// Import config data
import configData from "../../config.json";

export const NewTripForm = ({ newTripClicked, setNewTripClicked, fetchTrips, setActiveTrip, configureLists, setIsFetchProcessing, setProgressMessage, setIsLoading }) => {

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
    const createTrip = async (retryCount = 0) => {

        if (!tripCategory || !tripDuration || !requestTemplate) {
            setSubmissionErrorMessage('** Please select a response for all questions **');
            return;
        }

        setIsLoading(true);
        setIsFetchProcessing(true);
        
        try {

            const requestBodyContent = { tripName, tripCategory, tripDuration, requestTemplate };

            const { response, responseBodyText } = await createTripApi(requestBodyContent);
            setProgressMessage("");

            // Update the state that shows/hides the new trip console / questionnaire
            setNewTripClicked(false);

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
                configureLists(responseBodyText.lists, responseBodyText.allListItems); // Note setFetchIsProcessing(false) is being called in the configureLists function

                fetchTrips();

                // Reset the local states that records the values inputted by the user into the new trip form
                setTripName('');
                setTripCategory('');
                setTripDuration('');
                setSubmissionErrorMessage('');

                console.log("new trip created");

            } else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in createTrip function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return createTrip(retryCount + 1); // After the delay, try connecting again
            }
            
            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    const handleSubmit = event => {
        event.preventDefault();
        createTrip();
    }

    return (
        <div className="new-trip-form">
            {
                !newTripClicked ?
                    <div>
                        <p className="inline-text bolder">Make new lists:</p>
                        <input type="button"
                            className="pillbox-button"
                            value='New trip'
                            onClick={() => setNewTripClicked(true)} />
                    </div>

                    :
                    <div>
                        <p className="bolder">Make new lists:</p>

                        <p>Answer a couple of questions to populate your lists with some suggested items.</p>

                        <form onSubmit={handleSubmit}>

                            <div className="trip-question">

                                <label htmlFor="trip-name">Trip name</label>

                                <input type="text"
                                    id="trip-name-input"
                                    name="trip-name"
                                    value={tripName}
                                    onChange={event => setTripName(event.target.value)}
                                    placeholder="e.g. Rainbow Mountain"
                                    required />

                            </div>

                            <div className="trip-question">

                                <p className="bolder">What sort of trip?</p>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="ski-touring-radio"
                                        name="trip-category-radio"
                                        value="ski tour"
                                        className="radio-buttons"
                                        onClick={event => setTripCategory(event.target.value)} />

                                    <label htmlFor="ski-touring-radio">Ski tour/splitboarding</label>

                                </div>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="summer-mountaineering-radio"
                                        name="trip-category-radio"
                                        value="summer mountaineering"
                                        className="radio-buttons"
                                        onClick={event => setTripCategory(event.target.value)} />

                                    <label htmlFor="summer-mountaineering-radio">Summer mountaineering</label>
                                </div>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="hiking-radio"
                                        name="trip-category-radio"
                                        value="hiking"
                                        className="radio-buttons"
                                        onClick={event => setTripCategory(event.target.value)} />

                                    <label htmlFor="hiking-radio">Hiking</label>
                                </div>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="other-radio"
                                        name="trip-category-radio"
                                        value="other"
                                        className="radio-buttons"
                                        onClick={event => setTripCategory(event.target.value)} />

                                    <label htmlFor="other-radio">Other</label>
                                </div>
                            </div>


                            <div className="trip-question">
                                <p className="bolder">Day trip or overnight trip?</p>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="day-trip-radio"
                                        name="day-or-overnight-radio"
                                        value="day"
                                        className="radio-buttons"
                                        onClick={event => setTripDuration(event.target.value)} />

                                    <label htmlFor="day-trip-radio">Day trip</label>
                                </div>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="overnight-trip-radio"
                                        name="day-or-overnight-radio"
                                        value="overnight"
                                        className="radio-buttons"
                                        onClick={event => setTripDuration(event.target.value)} />

                                    <label htmlFor="overnight-trip-radio">Overnight trip</label>
                                </div>

                            </div>

                            <div className="trip-question">
                                <p className="bolder">Generate lists with suggested list items?</p>

                                <div className="radio-button-label-div">
                                    <input type="radio"
                                        id="request-template-radio-true"
                                        name="request-template"
                                        value="yes"
                                        className="radio-buttons"
                                        onClick={event => setRequestTemplate(event.target.value)} />

                                    <label htmlFor="request-template-radio-true">Yes</label>
                                </div>
                                <div className="radio-button-label-div">
                                    <input type="radio" id="request-template-radio-false" name="request-template" value="no"
                                        className="radio-buttons" onClick={event => setRequestTemplate(event.target.value)} />
                                    <label htmlFor="request-template-radio-false">No</label>
                                </div>
                            </div>

                            <input type="submit"
                                className="pillbox-button" 
                                value='Create trip' />
                            <input type="button"
                                className="pillbox-button"
                                value='Cancel'
                                onClick={cancelTrip} />
                            <p>{submissionErrorMessage}</p>
                        </form>
                    </div>
            }
            <p className="or-paragraph">-- or --</p>
        </div>
    );
}