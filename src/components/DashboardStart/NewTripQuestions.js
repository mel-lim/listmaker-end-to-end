import React from "react";

export const NewTripQuestions = ({ setNewTrip, setLoadLists, tripName, setTripName, tripCategory, setTripCategory, tripDuration, setTripDuration }) => {

    const cancelTrip = event => {
        event.preventDefault();
        setNewTrip(false);
        setTripName('');
        setTripCategory('');
        setTripDuration('');
    }

    const handleSubmit = event => {
        event.preventDefault();
                
    }

    return (
        <section className="trip-questions">
            <h5>Answer a couple of questions to populate your lists with some suggested items.</h5>

            <form onSubmit={handleSubmit}>
                <div className="trip-question">
                    <h5>Trip name</h5>
                    <input type="text" id="trip-name-input" name="trip-name" value={tripName} onChange={event => setTripName(event.target.value)} placeholder="e.g. Rainbow Mountain" />
                </div>

                <div className="trip-question">
                    <h5 className="lighter-weight">What sort of trip?</h5>
                    <div className="radio-button-label-div">
                        <input type="radio" id="ski-touring-radio" name="ski-touring-radio" value="ski-tour" className="radio-buttons" onClick={event => setTripCategory(event.target.value)} />
                        <label htmlFor="ski-touring-radio">Ski tour or splitboarding</label>
                    </div>
                </div>


                <div className="trip-question">
                    <h5 className="lighter-weight">Day trip or overnight trip?</h5>
                    <div className="radio-button-label-div">
                        <input type="radio" id="day-trip-radio" name="day-or-overnight-radio" value="day-trip" className="radio-buttons" onClick={event => setTripDuration(event.target.value)} />
                        <label htmlFor="day-trip-radio">Day trip</label>
                    </div>
                    <div className="radio-button-label-div">
                        <input type="radio" id="overnight-trip-radio" name="day-or-overnight-radio" value="overnight"
                            className="radio-buttons" onClick={event => setTripDuration(event.target.value)} />
                        <label htmlFor="overnight-trip-radio">Overnight trip</label>
                    </div>
                </div>

                {tripCategory && tripDuration && (<input type="submit" value='Load lists' />)}

                <input type="button" value='Cancel trip' onClick={cancelTrip} />

            </form>

        </section>
    );
}

