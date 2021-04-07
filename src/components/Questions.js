import React from "react";

export const Questions = ({ selected, setSelected, setNewTrip, setLoadLists}) => {


    return (
        <section className="trip-questions">
        <h5>Answer a couple of questions to start populate your lists with some suggested items.</h5>
            
            <form>
            <h5 className="lighter-weight">What sort of trip?</h5>
                <div className="radio-button-label-div">
                    <input type="radio" id="ski-touring-radio" name="ski-touring-radio" value="ski-touring" className="radio-buttons" />
                    <label htmlFor="ski-touring-radio">Ski touring</label>
                </div>
            </form>
            
            <form>
            <h5 className="lighter-weight">Day trip or overnight trip?</h5>
                <div className="radio-button-label-div">
                    <input type="radio" id="day-trip-radio" name="day-or-overnight-radio" value="day-trip" className="radio-buttons" onClick={(event) => setSelected(event.target.value)} />
                    <label htmlFor="day-trip-radio">Day trip</label>
                </div>
                <div className="radio-button-label-div">
                    <input type="radio" id="overnight-trip-radio" name="day-or-overnight-radio" value="overnight"
                        className="radio-buttons" onClick={(event) => setSelected(event.target.value)} />
                    <label htmlFor="overnight-trip-radio">Overnight trip</label>
                </div>
            </form>

            {selected && (<input type="button" value='Load lists' onClick={() => setLoadLists(true)} />)}

            <input type="button" value='Cancel trip' onClick={() => {setNewTrip(false); setSelected(''); }} />

        </section>
    );
}

