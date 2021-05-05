import React, { useState } from "react";

export const EditItemForm = ({ listItem, toggleEdit, editListItem }) => { // This is a component in of ListItem
    const [editedItemName, setEditedItemName] = useState(listItem.name);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEdit(); // This will show the list item in its 'settled' or fixed appearance, rather than as an input box
        if (editedItemName !== listItem.name) {
            editListItem(editedItemName); // This calls the editListItem function - see ListItem.js
        }
    }

    return (
        <div>
            <form className="edit-item" onSubmit={handleSubmit} data-testid={listItem.id + '-edit-form'}>
                <input type="text" name={listItem.id} className="edit-item-textbox" id={listItem.id} value={editedItemName} onChange={event => setEditedItemName(event.target.value)} />
                <input type="submit" className="done-button ui-button" value='' />
            </form>
        </div>
    );
}