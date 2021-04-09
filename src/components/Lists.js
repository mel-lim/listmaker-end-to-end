import React, { useState, useEffect } from "react";
import { List } from "../components/List";

export const Lists = ({ lists, allListItems }) => {

    return (
        <article id="lists-container">
            {lists.map((list, index) => <List key={`list-${list.id}`} listTitle={list.title} initialListItems={allListItems[index]} />)}
        </article>
    );
}