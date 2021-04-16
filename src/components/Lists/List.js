import React, { useState, useEffect } from "react";
import { AddUndoRow } from "./AddUndoRow";
import { ListItem } from "./ListItem/ListItem";

export const List = ({ listTitle, index, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems, setListItemsHaveChangedSinceLastSave }) => {

    const [nextIdNum, setNextIdNum] = useState(0);
    const [listItems, setListItems] = useState(allListItems[index]);
    const [deletedListItems, setDeletedListItems] = useState(allDeletedItems[index]); // This will be an empty array to begin

    // Every time we edit our listItems state, we pass on the change to the allListItems variable and push that up to localstorage for safekeeping
    useEffect(() => {
        const currentAllListItems = allListItems;
        currentAllListItems.splice(index, 1, listItems);
        setAllListItems(currentAllListItems);
        localStorage.setItem("allListItems", JSON.stringify(allListItems));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listItems]);

    // Every time we edit our deletedItems state, we pass on the change to the allDeletedItems variable and push that up to localstorage for safekeeping
    useEffect(() => {
        const currentAllDeletedItems = allDeletedItems;
        currentAllDeletedItems.splice(index, 1, deletedListItems);
        setAllDeletedItems(currentAllDeletedItems);
        localStorage.setItem("allDeletedItems", JSON.stringify(allDeletedItems));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deletedListItems]);

    const generateTempItemId = () => {
        const itemId = `tempItem-${nextIdNum}`;
        setNextIdNum(prevNextIdNum => prevNextIdNum + 1);
        return itemId;
    }

    const addListItem = newItemName => {
        const newListItem = {
            id: generateTempItemId(),
            name: newItemName,
            flag: 'newItem'
        }
        if (!listItems) {
            setListItems([newListItem]);
        } else {
            setListItems(prevListItems => [...prevListItems, newListItem]);
        }
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
            <h3>{listTitle}</h3>
            {
                listItems ?
                    listItems.map(listItem =>
                        <ListItem key={`item-${listItem.id}`} listItem={listItem} listItems={listItems} setListItems={setListItems} removeListItem={removeListItem} setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} />
                    ) :
                    null
            }
            <AddUndoRow addListItem={addListItem} undoDelete={undoDelete} />
        </section>
    );
}