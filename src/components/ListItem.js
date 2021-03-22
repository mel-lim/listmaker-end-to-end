import React, { useState } from "react";
import { SettledItem } from "./SettledItem";
import { EditItemForm } from "./EditItemForm";

export const ListItem = ({ listItem, listItems, setListItems, removeListItem }) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    return (
        <div>
            <div className="list-item">
                <div className="delete-edit-buttons-container">
                    <button className="delete-button ui-button" onClick={removeListItem} data-testid={listItem.itemId + '-delete'}></button>
                    <button className="edit-button ui-button" onClick={toggleEdit} data-testid={listItem.itemId + '-edit'}></button>
                </div>
                {!isEditing ? 
                <SettledItem listItem={listItem} /> : 
                <EditItemForm listItem={listItem} listItems={listItems} setListItems={setListItems} toggleEdit={toggleEdit} />
                }
            </div>
            <hr />
        </div>
    );
}
