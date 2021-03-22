import React, { useState, useEffect } from "react";
import { AddUndoRow } from "./AddUndoRow";
import { ListItem } from "./ListItem";

export const List = ({ list }) => {

    const [listItems, setListItems] = useState([]);
    const [nextIdNum, setNextIdNum] = useState(0);

    useEffect(() => {
        const suggestedListItems = [];
        for (let i = 0; i < list.itemNames.length; i++) {
            suggestedListItems.push({ itemId: `${list.listId}-item-${i}`, itemName: list.itemNames[i] });
        }
        setListItems(suggestedListItems);
        setNextIdNum(list.itemNames.length);
        // eslint-disable-next-line
    }, []);

    const generateItemId = () => {
        const itemId = `${list.listId}-item-${nextIdNum}`;
        setNextIdNum(prevNextIdNum => prevNextIdNum + 1);
        console.log(nextIdNum);
        return itemId;
    }

    const [deletedListItems, setDeletedListItems] = useState([]);

    const addListItem = newItemName => {
        const newListItem = {
            itemId: generateItemId(),
            itemName: newItemName
        }
        setListItems(prevListItems => [...prevListItems, newListItem]);
    }

    const removeListItem = itemId => {
        const index = listItems.findIndex(listItem => listItem.itemId === itemId);
        const deletedItemWithIndex = {
            deletedItem: listItems[index],
            originalIndex: index
        };
        setDeletedListItems(prevDeletedListItems => [deletedItemWithIndex, ...prevDeletedListItems]);
        const updatedList = listItems.filter(listItem => listItem.itemId !== itemId);
        setListItems(updatedList);
    }

    const undoDelete = () => {
        if (deletedListItems.length === 0) {
            return;
        }
        const lastDeletedItem = deletedListItems[0];
        const undoneListItems = [...listItems];
        undoneListItems.splice(lastDeletedItem.originalIndex, 0, lastDeletedItem.deletedItem)
        setListItems(undoneListItems);
        const updatedDeletedListItems = deletedListItems.slice(1);
        setDeletedListItems(updatedDeletedListItems);
    }

    return (
        <section className="list-container" data-testid={list.listId} >
            <h3>{list.listTitle}</h3>
            {listItems.map(listItem =>
                <ListItem key={listItem.itemId} listItem={listItem} listItems={listItems} setListItems={setListItems} removeListItem={() => { removeListItem(listItem.itemId) }} />
            )}
            <AddUndoRow addListItem={addListItem} undoDelete={undoDelete} />
        </section>

    );
}