import React from "react";
import { List } from "./List";

export const Lists = ({ lists, allListItems, setAllListItems, allDeletedItems, setAllDeletedItems }) => {

    return (
        <article id="lists-container">
            {lists.map((list, index) => <List key={`list-${list.id}`} listTitle={list.title} index={index} allListItems={allListItems} setAllListItems={setAllListItems} allDeletedItems={allDeletedItems} setAllDeletedItems={setAllDeletedItems} />)}
        </article>
    );
}