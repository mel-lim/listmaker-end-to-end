import React, { useState, useEffect } from "react";
import { ConfirmDeleteListModal } from "./ConfirmDeleteListModal";
import { SettledListTitle } from "./SettledListTitle";
import { AddUndoRow } from "./AddUndoRow";
import { EditListTitleForm } from "./EditListTitleForm";
import { ListItem } from "../ListItem/ListItem";
import { editListTitleApi, deleteListApi, newListItemApi, deleteListItemApi, undoDeleteListItemApi } from "../../../api";

export const List = ({ tripId, list, lists, setLists, index, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems }) => {

    const [isEditingListTitle, setIsEditingListTitle] = useState(false);

    const [nextIdNum, setNextIdNum] = useState(0);
    const [listItems, setListItems] = useState(allListItems[index]);
    const [deletedListItems, setDeletedListItems] = useState(allDeletedItems[index]); // This will be an empty array to begin

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
    const editListTitle = async editedListTitle => {

        if (editedListTitle === list.title) {
            console.log("no difference in list title");
            return;
        }

        // Make a put api call to update the db with the new list item
        const requestBodyContent = { editedListTitle };
        const { response, responseBodyText } = await editListTitleApi(tripId, list.id, requestBodyContent);

        if (response.status === 200) {
            const currentList = Object.assign({}, list);
            currentList.title = editedListTitle;
            const currentLists = [...lists];
            currentLists[index] = currentList;
            setLists(currentLists);
            console.log(responseBodyText.message, ': ', editedListTitle);
        }

        else {
            console.log(responseBodyText.message);
        }
    }

    // DELETE LIST
    const deleteList = async () => {

        // Make put api call to update the item in the db and set is_deleted to true
        const response = await deleteListApi(tripId, list.id);

        if (response.status === 204) {
            // Remove the list items from the allListItems state
            const currentAllListItems = [...allListItems];
            currentAllListItems.splice(index, 1);
            setAllListItems(currentAllListItems);

            // Remove the list from the lists state
            const currentLists = [...lists];
            currentLists.splice(index, 1);
            setLists(currentLists);

            console.log("list deleted");
        }

        else {
            console.log(response.status);
        }
    }

    const generateTempItemId = () => {
        const itemId = `tempItem-${nextIdNum}`;
        setNextIdNum(prevNextIdNum => prevNextIdNum + 1);
        return itemId;
    }

    const addListItem = async newItemName => {
        const newListItem = {
            id: generateTempItemId(),
            name: newItemName,
            list_id: list.id,
            is_checked: false
        }

        // Make post api call to save new list item to db
        const requestBodyContent = { newItemName };
        const { response, responseBodyText } = await newListItemApi(tripId, list.id, requestBodyContent);

        if (response.status === 201) {
            newListItem.id = responseBodyText.id; // Update the new list item with the actual id from the db
            if (!listItems) {
                setListItems([newListItem]);
            } else {
                setListItems(prevListItems => [...prevListItems, newListItem]);
            }
        } else {
            console.log(responseBodyText.message);
        }
    }

    const removeListItem = async itemId => {
        // Make put api call to update the item in the db and set is_deleted to true
        const { response, responseBodyText } = await deleteListItemApi(tripId, list.id, itemId);

        if (response.status === 200) {
            const index = listItems.findIndex(listItem => listItem.id === itemId);
            const deletedItemWithIndex = {
                deletedItem: listItems[index],
                originalIndex: index
            };
            if (!deletedListItems) {
                setDeletedListItems([deletedItemWithIndex]);
            } else {
                setDeletedListItems(prevDeletedListItems => [deletedItemWithIndex, ...prevDeletedListItems]);
            }

            const updatedList = listItems.filter(listItem => listItem.id !== itemId);
            setListItems(updatedList);

        } else {
            console.log(responseBodyText.message);
        }
    }

    const undoDelete = async () => {
        if (deletedListItems.length === 0) {
            return;
        }
        const lastDeletedItem = deletedListItems[0];
        const { response, responseBodyText } = await undoDeleteListItemApi(tripId, list.id, lastDeletedItem.deletedItem.id);

        if (response.status === 200) {
            const currentListItems = [...listItems];
            currentListItems.splice(lastDeletedItem.originalIndex, 0, lastDeletedItem.deletedItem)
            setListItems(currentListItems);
            const updatedDeletedListItems = deletedListItems.slice(1);
            setDeletedListItems(updatedDeletedListItems);

        } else {
            console.log(responseBodyText.message);
        }
    }

    return (
        <section className="list-container">

            <ConfirmDeleteListModal
                list={list}
                deleteList={deleteList} />

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
                            removeListItem={removeListItem} />
                    ) :
                    null
            }
            <AddUndoRow
                addListItem={addListItem}
                undoDelete={undoDelete} />

        </section>
    );
}