import React from "react";

export const SettledItem = ({ listItem }) => {

    return (
        <div className="listitem-and-checkbox-container">
            <label className="item-display-name" htmlFor={listItem.id} >{listItem.name}</label>
            {/* data-testid={listItem.itemId + '-item-label'} */}
            <input type="checkbox" className="checkbox" id={listItem.id} name={listItem.id} />
        </div>
    );
}