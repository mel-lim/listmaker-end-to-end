import React, { useState, useEffect } from "react";
import { List } from "../components/List";
import { gearList, clothingList, dayFoodList, overnightFoodList, campingList } from "../resources/ListData";

export const Lists = ({ selected }) => {

    const [lists, setLists] = useState([]);

    useEffect(() => {
        if (selected.length === 0) {
            return;
        } else if (selected === "day-trip") {
            setLists([gearList, clothingList, dayFoodList]);
        } else if (selected === "overnight") {
            setLists([gearList, clothingList, overnightFoodList, campingList]);
        }
      }, [selected]);

    return (
        <article id="lists-container">
            {lists.map(list => <List key={list.listId} list={list} />)}
        </article>
    );
}