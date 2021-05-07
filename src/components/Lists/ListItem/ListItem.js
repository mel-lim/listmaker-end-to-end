import React, { useState } from "react";
import { SettledItem } from "./SettledItem";
import { EditItemForm } from "./EditItemForm";
import { editListItemApi } from "../../../api";

export const ListItem = ({ tripId, listItem, listItems, setListItems, deleteListItem }) => { // This is a component in List
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const editListItem = async editedItemName => {

        // Make a put api call to update the db with the new list item
        const requestBodyContent = { editedItemName };
        const { response, responseBodyText } = await editListItemApi(tripId, listItem.list_id, listItem.id, requestBodyContent);

        if (response.status === 200) {
            // REVIEW WHETHER WE WILL NEED TO KEEP THE FOLLOWING CODE ONCE THE NEW SAVE FUNCTIONALITY IS DONE
            const index = listItems.findIndex(item => item.id === listItem.id); // Get the index of the item we are editing
            let editedListItems = [...listItems]; // Makes a shallow copy of the listItems array 
            editedListItems[index].name = editedItemName; // Edit the name property of the relevant item
            setListItems(editedListItems); // Set the now edited array as the new listItems array
        }

        else {
            console.log(responseBodyText.message);
        }
    }

    const handleClickDelete = event => {
        event.preventDefault();
        deleteListItem(listItem.id); // See List.js
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
                        toggleEdit={toggleEdit}
                        editListItem={editListItem} />
                }
            </div>
            <hr />
        </div>
    );
}
