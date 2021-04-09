import React, { useState } from "react";
import { AddUndoRow } from "./AddUndoRow";
import { ListItem } from "./ListItem/ListItem";

export const List = ({ listTitle, initialListItems }) => {

    const [nextIdNum, setNextIdNum] = useState(0);
    const [listItems, setListItems] = useState(initialListItems);
    const [deletedListItems, setDeletedListItems] = useState([]);

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
        setListItems(prevListItems => [...prevListItems, newListItem]);
    }

    const removeListItem = itemId => {
        const index = listItems.findIndex(listItem => listItem.id === itemId);
        const deletedItemWithIndex = {
            deletedItem: listItems[index],
            originalIndex: index
        };
        setDeletedListItems(prevDeletedListItems => [deletedItemWithIndex, ...prevDeletedListItems]);
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
            {listItems.map(listItem =>
                <ListItem key={`item-${listItem.id}`} listItem={listItem} listItems={listItems} setListItems={setListItems} removeListItem={removeListItem} />
            )}
            <AddUndoRow addListItem={addListItem} undoDelete={undoDelete} />
        </section>
    );
}