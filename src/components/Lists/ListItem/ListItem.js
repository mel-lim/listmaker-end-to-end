import React, { useState } from "react";
import { SettledItem } from "./SettledItem";
import { EditItemForm } from "./EditItemForm";

export const ListItem = ({ listItem, listItems, setListItems, removeListItem, setListItemsHaveChangedSinceLastSave }) => { // This is a component in List
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const handleClickDelete = event => {
        event.preventDefault();
        removeListItem(listItem.id); // See List.js
    }

    return (
        <div>
            <div className="list-item">
                <div className="delete-edit-buttons-container">
                    <button className="delete-button ui-button"
                        onClick={handleClickDelete}
                        data-testid={listItem.id + '-delete'}>
                    </button>
                    <button className="edit-button ui-button"
                        onClick={toggleEdit}
                        data-testid={listItem.id + '-edit'}>
                    </button>
                </div>
                {!isEditing ?
                    <SettledItem listItem={listItem} /> :
                    <EditItemForm listItem={listItem}
                        listItems={listItems}
                        setListItems={setListItems}
                        toggleEdit={toggleEdit}
                        setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} />
                }
            </div>
            <hr />
        </div>
    );
}
