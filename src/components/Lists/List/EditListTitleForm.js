import React, { useState } from "react";

export const EditListTitleForm = ({ list, editListTitle, toggleEditListTitle }) => { // This is a component in List 

    const [editedListTitle, setEditedListTitle] = useState(list.title);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEditListTitle(); // This will show the list title in its 'settled' or fixed appearance, rather than as an input box.
        editListTitle(editedListTitle); // This calls the editListTitle function defined in List.js
    }

    return (
        <div className="edit-list-title-container">
            <form onSubmit={handleSubmit}>
                <input type="text" value={editedListTitle} onChange={event => setEditedListTitle(event.target.value)} />
                <input type="submit" className="done-button ui-button" value='' />
            </form>
        </div>

    )
}