import React, { useState, useEffect } from "react";
import { ConfirmDeleteListModal } from "./ConfirmDeleteListModal";
import { SettledListTitle } from "./SettledListTitle";
import { AddUndoRow } from "./AddUndoRow";
import { EditListTitleForm } from "./EditListTitleForm";
import { ListItem } from "../ListItem/ListItem";
import { saveNewListItemApi } from "../../../api";

export const List = ({ tripId, list, lists, setLists, index, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems, setListItemsHaveChangedSinceLastSave }) => {

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

    const deleteList = () => {
        const currentAllListItems = [...allListItems];
        currentAllListItems.splice(index, 1);
        setAllListItems(currentAllListItems);
        const currentLists = [...lists];
        currentLists.splice(index, 1);
        setLists(currentLists);
        setListItemsHaveChangedSinceLastSave(true);
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
        const requestBodyContent = { newListItem };
        const { response, responseBodyText } = await saveNewListItemApi(tripId, requestBodyContent);

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

        // LEAVE FOR NOW BUT I THINK WE WILL PROBABLY BE ABLE TO GET RID OF THIS
        setListItemsHaveChangedSinceLastSave(true);
    }

    const removeListItem = itemId => {
        console.log(allDeletedItems);
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
        setListItemsHaveChangedSinceLastSave(true);

        const updatedList = listItems.filter(listItem => listItem.id !== itemId);
        setListItems(updatedList);
    }

    const undoDelete = () => {
        if (deletedListItems.length === 0) {
            return;
        }
        const lastDeletedItem = deletedListItems[0];
        const currentListItems = [...listItems];
        currentListItems.splice(lastDeletedItem.originalIndex, 0, lastDeletedItem.deletedItem)
        setListItems(currentListItems);
        const updatedDeletedListItems = deletedListItems.slice(1);
        setDeletedListItems(updatedDeletedListItems);
    }

    return (
        <section className="list-container">

            <ConfirmDeleteListModal list={list}
                deleteList={deleteList} />

            <span className="clear"></span>

            {
                !isEditingListTitle ?
                    <SettledListTitle
                        listTitle={list.title}
                        toggleEditListTitle={toggleEditListTitle} />
                    : <EditListTitleForm
                        list={list}
                        lists={lists}
                        setLists={setLists}
                        index={index}
                        toggleEditListTitle={toggleEditListTitle}
                        setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} />
            }
            {
                listItems ?
                    listItems.map(listItem =>
                        <ListItem key={`item-${listItem.id}`}
                            tripId={tripId}
                            listItem={listItem}
                            listItems={listItems}
                            setListItems={setListItems}
                            removeListItem={removeListItem}
                            setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} />
                    ) :
                    null
            }
            <AddUndoRow addListItem={addListItem}
                undoDelete={undoDelete} />

        </section>
    );
}