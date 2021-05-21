import React, { useState, useEffect } from "react";
import { ConfirmDeleteListModal } from "./ConfirmDeleteListModal";
import { SettledListTitle } from "./SettledListTitle";
import { AddUndoRow } from "./AddUndoRow";
import { EditListTitleForm } from "./EditListTitleForm";
import { ListItem } from "../ListItem/ListItem";

import { delay, editListTitleApi, deleteListApi, newListItemApi, deleteListItemApi, undoDeleteListItemApi } from "../../../api";

// Import config data
import configData from "../../../config.json";

export const List = ({ tripId, list, lists, setLists, index, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems, setProgressMessage, setIsLoading }) => { // Component in Lists.js

    const [isEditingListTitle, setIsEditingListTitle] = useState(false);
    const [listItems, setListItems] = useState(allListItems[index]);
    const [deletedListItems, setDeletedListItems] = useState(allDeletedItems[index]); // This will be an empty array to begin
    const [modalErrorMessage, setModalErrorMessage] = useState(null);

    // Every time we edit our listItems state, we pass on the change to the allListItems variable and push that up to localstorage for safekeeping
    useEffect(() => {
        const currentAllListItems = [...allListItems];
        currentAllListItems.splice(index, 1, listItems);
        setAllListItems(currentAllListItems);
        localStorage.setItem("allListItems", JSON.stringify(allListItems));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listItems]);

    // Every time we edit our deletedItems state, we pass on the change to the allDeletedItems variable and push that up to localstorage for safekeeping
    useEffect(() => {
        const currentAllDeletedItems = [...allDeletedItems];
        currentAllDeletedItems.splice(index, 1, deletedListItems);
        setAllDeletedItems(currentAllDeletedItems);
        localStorage.setItem("allDeletedItems", JSON.stringify(allDeletedItems));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedListItems]);

    const toggleEditListTitle = () => {
        setIsEditingListTitle(!isEditingListTitle);
    }

    // EDIT LIST TITLE
    const editListTitle = async (editedListTitle, retryCount = 0) => {

        if (editedListTitle === list.title) {
            console.log("no difference in list title");
            return;
        }

        setIsLoading(true);

        try {
            // Make a put api call to update the db with the new list item
            const requestBodyContent = { editedListTitle };
            const { response, responseBodyText } = await editListTitleApi(tripId, list.id, requestBodyContent);
            setProgressMessage("");

            if (response.ok === true) {
                const currentList = Object.assign({}, list);
                currentList.title = editedListTitle;
                const currentLists = [...lists];
                currentLists[index] = currentList;
                setLists(currentLists);
                console.log(responseBodyText.message, ': ', editedListTitle);
            }

            else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch {
            console.error("Error in editListTitle function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return editListTitle(editedListTitle, retryCount + 1); // After the delay, try connecting again
            }
            
            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    // DELETE LIST
    const deleteList = async (retryCount = 0) => {
        setIsLoading(true);

        try {
            // Make put api call to update the item in the db and set is_deleted to true
            const response = await deleteListApi(tripId, list.id);
            setProgressMessage("");

            if (response.ok === true) {
                // Remove the list items from the allListItems state
                const currentAllListItems = [...allListItems];
                currentAllListItems.splice(index, 1);
                setAllListItems(currentAllListItems);

                // Remove the list from the lists state
                const currentLists = [...lists];
                currentLists.splice(index, 1);
                setLists(currentLists);

                console.log("list deleted");
                setModalErrorMessage(null);
            }

            else {
                console.log(response.status);
                setModalErrorMessage('This list cannot be deleted at this moment.');
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in deleteList function. Cannot connect to server");
            setIsLoading(false);
        }
    }

    // Keep this for now in case useful for developing offline mode
    /* const generateTempItemId = () => {
        const itemId = `tempItem-${nextIdNum}`;
        setNextIdNum(prevNextIdNum => prevNextIdNum + 1);
        return itemId;
    } */

    // ADD LIST ITEM
    const addListItem = async (newItemName, retryCount = 0) => {
        setIsLoading(true);

        try {

            // Make post api call to save new list item to db
            const requestBodyContent = { newItemName };
            const { response, responseBodyText } = await newListItemApi(tripId, list.id, requestBodyContent);
            setProgressMessage("");

            if (response.ok === true) {
                const newListItem = {
                    id: responseBodyText.id,
                    name: newItemName,
                    list_id: list.id,
                    is_checked: false
                };
                if (!listItems) {
                    setListItems([newListItem]);
                } else {
                    setListItems(prevListItems => [...prevListItems, newListItem]);
                }
                console.log("new list item added");

            } else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in addListItem function. Cannot connect to server");

            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return addListItem(newItemName, retryCount + 1); // After the delay, try connecting again
            }

            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    // DELETE LIST ITEM
    const deleteListItem = async (itemId, retryCount = 0) => {
        setIsLoading(true);

        try {
            // Make put api call to update the item in the db and set is_deleted to true
            const { response, responseBodyText } = await deleteListItemApi(tripId, list.id, itemId);
            setProgressMessage("");

            if (response.ok === true) {
                // Get the index of the item that was deleted from within the listItems array
                const index = listItems.findIndex(listItem => listItem.id === itemId);

                // Store deleted item and its original index within the listItems array, in the deleteListItems state
                const deletedItemWithIndex = {
                    deletedItem: listItems[index],
                    originalIndex: index
                };
                if (!deletedListItems) {
                    setDeletedListItems([deletedItemWithIndex]);
                } else {
                    setDeletedListItems(prevDeletedListItems => [deletedItemWithIndex, ...prevDeletedListItems]);
                }

                // Set listItems state so that it has the deleted item removed from it
                const updatedList = listItems.filter(listItem => listItem.id !== itemId);
                setListItems(updatedList);

                console.log("item deleted");

            } else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in deleteListItem function. Cannot connect to server");
            
            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return deleteListItem(itemId, retryCount + 1); // After the delay, try connecting again
            }
            
            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    // UNDO DELETE ITEM
    const undoDelete = async (retryCount = 0) => {
        // If nothing to undo, return
        if (deletedListItems.length === 0) {
            return;
        }

        setIsLoading(true);

        // Get the most recently deleted item from the deletedListItems array
        const lastDeletedItem = deletedListItems[0];

        try {
            // Make undo delete api call
            const { response, responseBodyText } = await undoDeleteListItemApi(tripId, list.id, lastDeletedItem.deletedItem.id);
            setProgressMessage("");

            if (response.ok === true) {

                // Put the last deleted item back into the listItems array
                const currentListItems = [...listItems];
                currentListItems.splice(lastDeletedItem.originalIndex, 0, lastDeletedItem.deletedItem)
                setListItems(currentListItems);

                // Remove the now undone deleted item from the deletedListItems array
                const updatedDeletedListItems = deletedListItems.slice(1);
                setDeletedListItems(updatedDeletedListItems);

                console.log("delete undone");

            } else {
                console.log(responseBodyText.message);
                setProgressMessage("** " + responseBodyText.message + " **");
            }

            setIsLoading(false);

        } catch (error) {
            console.error("Error in undoDelete function. Cannot connect to server");
            
            if (retryCount < parseInt(configData.MAX_RETRY_COUNT)) {
                setProgressMessage(`The server not responding. Trying again...`);
                await delay(retryCount); // Exponential backoff - see api.js
                return undoDelete(retryCount + 1); // After the delay, try connecting again
            }

            setProgressMessage('Sorry, our server is not responding. Please check your internet connection or come back later.');
            setIsLoading(false);
        }
    }

    return (
        <section className="list-container">

            <ConfirmDeleteListModal
                list={list}
                deleteList={deleteList}
                modalErrorMessage={modalErrorMessage} />
                
            <span className="clear"></span>

            {
                !isEditingListTitle ?
                    <SettledListTitle
                        listTitle={list.title}
                        toggleEditListTitle={toggleEditListTitle} />
                    : <EditListTitleForm
                        list={list}
                        editListTitle={editListTitle}
                        lists={lists}
                        setLists={setLists}
                        index={index}
                        toggleEditListTitle={toggleEditListTitle} />
            }
            {
                listItems ?
                    listItems.map(listItem =>
                        <ListItem key={`item-${listItem.id}`}
                            tripId={tripId}
                            listItem={listItem}
                            listItems={listItems}
                            setListItems={setListItems}
                            deleteListItem={deleteListItem}
                            setProgressMessage={setProgressMessage}
                            setIsLoading={setIsLoading} />
                    ) :
                    null
            }
            <AddUndoRow
                addListItem={addListItem}
                undoDelete={undoDelete} />

        </section>
    );
}