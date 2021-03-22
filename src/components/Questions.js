import React from "react";

export const Questions = ({ setSelected }) => {


    return (
        <section className="user-question">
            <h3 className="lighter-weight">Day trip or overnight trip?</h3>
            <form>
                <div>
                    <input type="radio" id="day-trip-radio" name="day-or-overnight-radio" value="day-trip" className="radio-buttons" onClick={event => { setSelected(event.target.value) }} />
                    <label htmlFor="day-trip-radio">Day trip</label>
                </div>
                <div>
                    <input type="radio" id="overnight-trip-radio" name="day-or-overnight-radio" value="overnight"
                        className="radio-buttons" onClick={event => { setSelected(event.target.value) }} />
                    <label htmlFor="overnight-trip-radio">Overnight trip</label>
                </div>
            </form>

        </section>
    );
}

