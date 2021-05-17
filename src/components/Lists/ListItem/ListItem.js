import React, { useState } from "react";
import { SettledItem } from "./SettledItem";
import { EditItemForm } from "./EditItemForm";
import { delay, editListItemApi } from "../../../api";

// Import config data
import configData from "../../../config.json";

export const ListItem = ({ tripId, listItem, listItems, setListItems, deleteListItem, setProgressMessage, setIsLoading }) => { // This is a component in List

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    }

    const editListItem = async (editedItemName, retryCount = 0) => {
        setIsLoading(true);

        try {
            // Make a put api call to update the db with the new list item
            const requestBodyContent = { editedItemName };
            const { response, responseBodyText } = await editListItemApi(tripId, listItem.list_id, listItem.id, requestBodyContent);
            setProgressMessage("");

            if (response.ok === true) {
                // REVIEW WHETHER WE WILL NEED TO KEEP THE FOLLOWING CODE ONCE THE NEW SAVE FUNCTIONALITY IS DONE
                const index = listItems.findIndex(item => item.id === listItem.id); // Get the index of the item we are editing
                let editedListItems = [...listItems]; // Makes a shallow copy of the listItems array 
                editedListItems[index].name = editedItemName; // Edit the name property of the relevant item
                setListItems(editedListItems); // Set the now edited array as the new listItems array
            }

            else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch {
            console.error("Error in editListItem function. Cannot connect to server");
            
            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return editListItem(editedItemName, retryCount + 1); // After the delay, try connecting again
            }

            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
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
