import React from "react";

export const SettledItem = ({ listItem }) => {

    return (
        <div className="listitem-and-checkbox-container">
            <label className="item-display-name" htmlFor={listItem.itemId} data-testid={listItem.itemId + '-item-label'}>{listItem.itemName}</label>
            <input type="checkbox" className="checkbox" id={listItem.itemId} name={listItem.itemId} />
        </div>
    );
}