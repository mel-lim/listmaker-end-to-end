import React, { useState } from "react";

export const EditListTitleForm = ({ list, lists, setLists, index, toggleEditListTitle, setListItemsHaveChangedSinceLastSave }) => {

    const [editedListTitle, setEditedListTitle] = useState(list.title);

    const handleSubmit = event => {
        event.preventDefault();
        toggleEditListTitle();
        if (editedListTitle !== list.title) {
            const currentList = Object.assign({}, list);
            currentList.title = editedListTitle;
            const currentLists = [...lists];
            currentLists[index] = currentList;
            setLists(currentLists);
            setListItemsHaveChangedSinceLastSave(true);
        }
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