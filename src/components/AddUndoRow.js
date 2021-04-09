import React, { useState } from "react";

export const AddUndoRow = ({ addListItem, undoDelete }) => {

    const [userInput, setUserInput] = useState('');
    
    const handleSubmit = event => {
        event.preventDefault();
        if (userInput.length === 0) {
            return;
        }
        addListItem(userInput);
        setUserInput('');
    }

    return (
            <div className="add-undo-row">
                <form className="text-input-form" onSubmit={handleSubmit}>
                    <input type="text" name="user-input-text" className="user-input-text" value={userInput} onChange={event => setUserInput(event.target.value)} />
                    <input type="submit" className="add-button ui-button" value='' title="add item"/>
                </form>
                <button className="undo-button ui-button" onClick={undoDelete} name="undo" title="undo delete"></button>
            </div>
    );
}