import React, {useState} from "react";

export const EditItemForm = ({ listItem, listItems, setListItems, toggleEdit, setListItemsHaveChangedSinceLastSave }) => {
    const [editedItemName, setEditedItemName] = useState(listItem.name);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEdit();
        const index = listItems.findIndex(item => item.id === listItem.id);
        let editedListItems = [...listItems];
        editedListItems[index].name = editedItemName;
        setListItems(editedListItems);
        setListItemsHaveChangedSinceLastSave(true);
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