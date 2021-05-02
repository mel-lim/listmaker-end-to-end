import React from "react";
import { List } from "./List/List";

export const Lists = ({ lists, setLists, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems, setListItemsHaveChangedSinceLastSave }) => {

    return (
        <article id="lists-container">
                {lists.map((list, index) =>
                    <List key={`list-${list.id}`}
                        list={list}
                        lists={lists}
                        setLists={setLists}
                        index={index}
                        allListItems={allListItems}
                        setAllListItems={setAllListItems}
                        allDeletedItems={allDeletedItems}
                        setAllDeletedItems={setAllDeletedItems}
                        setListItemsHaveChangedSinceLastSave={setListItemsHaveChangedSinceLastSave} />)}
        </article>
    );
}