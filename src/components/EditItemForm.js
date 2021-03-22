import React, {useState} from "react";

export const EditItemForm = ({ listItem, listItems, setListItems, toggleEdit }) => {
    const [editedItemName, setEditedItemName] = useState(listItem.itemName);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEdit();
        const index = listItems.findIndex(item => item.itemId === listItem.itemId);
        let editedListItems = [...listItems];
        editedListItems[index].itemName = editedItemName;
        setListItems(editedListItems);
    }

    return (
        <div>
            <form className="edit-item" onSubmit={handleSubmit} data-testid={listItem.itemId + '-edit-form'}>
                <input type="text" name={listItem.itemId} className="edit-item-textbox" id={listItem.itemId} value={editedItemName} onChange={event => setEditedItemName(event.target.value)} />
                <input type="submit" className="done-button ui-button" value='' />
            </form>
        </div>
    );
}