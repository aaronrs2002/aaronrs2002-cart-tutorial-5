import React, { useEffect, useState } from "react";

const ItemSelector = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [items, setItems] = useState([]);

    useEffect(() => {
        if (loaded == false) {
            if (localStorage.getItem("items")) {
                setItems((items) => JSON.parse(localStorage.getItem("items")));
            }
            setLoaded((loaded) => true);
        }
    });


    return (

        <select className="form-control" name="itemSelect" onChange={() => props.populateFields()}>
            <option value="default">Select Item</option>
            {items ? items.map((items, i) => {
                return (<option key={i} value={i}>{items.itemName}</option>)
            }) : null}
        </select>

    )

}

export default ItemSelector;