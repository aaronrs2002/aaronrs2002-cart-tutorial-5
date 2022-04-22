import React, { useEffect, useState } from "react";
import Validate from "./Validate";
import ItemSelector from "./ItemSelector";

const CMS = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [items, setItems] = useState([]);
    let [activeFunc, setActiveFunc] = useState("add");
    let [toggle, setToggle] = useState("default");


    const clearForm = () => {
        [].forEach.call(document.querySelectorAll("input, textarea"), function (e) {
            e.value = "";
        });
        [].forEach.call(document.querySelectorAll("select"), function (e) {
            e.selectIndex = 0;
        })
    }


    const addItem = () => {
        Validate(["itemName", "stockQty", "price", "category", "details"]);
        if (document.querySelector(".error")) {
            props.showAlert("There is an error in your form.", "danger");
            return false;
        } else {
            let tempItems = items;
            let itemName = document.querySelector("[name='itemName']").value.toLowerCase();
            let stockQty = document.querySelector("[name='stockQty']").value;
            let price = document.querySelector("[name='price']").value;

            let category = document.querySelector("[name='category']").value.toLowerCase();
            let details = document.querySelector("[name='details']").value.toLowerCase();
            tempItems = [...items, { itemName, stockQty, price, category, details }];
            setItems((items) => tempItems);
            localStorage.setItem("items", JSON.stringify(tempItems));
            props.showAlert(itemName + " added successfully.", "success");
            clearForm();

        }
    }

    const editItem = () => {
        Validate(["itemName", "stockQty", "price", "category", "details"]);
        if (document.querySelector(".error")) {
            props.showAlert("There is an error in your form.", "danger");
            return false;
        } else {
            let tempItems = items
            let selectedItem = document.querySelector("select[name='itemSelect']").value;
            tempItems[Number(selectedItem)].itemName = document.querySelector("[name='itemName']").value.toLowerCase();
            tempItems[Number(selectedItem)].price = document.querySelector("[name='price']").value;
            tempItems[Number(selectedItem)].stockQty = document.querySelector("[name='stockQty']").value;
            tempItems[Number(selectedItem)].category = document.querySelector("[name='category']").value.toLowerCase();
            tempItems[Number(selectedItem)].details = document.querySelector("[name='details']").value.toLowerCase();
            setItems((items) => tempItems);
            localStorage.setItem("items", JSON.stringify(tempItems));
        }


    }

    const populateFields = () => {
        let selectedItem = document.querySelector("select[name='itemSelect']").value;
        if (selectedItem === "defaut") {
            return false;
        }
        document.querySelector("[name='itemName']").value = items[Number(selectedItem)].itemName;
        document.querySelector("[name='stockQty']").value = items[Number(selectedItem)].stockQty;
        document.querySelector("[name='price']").value = items[Number(selectedItem)].price;
        document.querySelector("[name='category']").value = items[Number(selectedItem)].category;
        document.querySelector("[name='details']").value = items[Number(selectedItem)].details;


    }

    const deleteItem = () => {
        let tempItems = [];
        let selectedItem = document.querySelector("select[name='itemSelect']").value;
        for (let i = 0; i < items.length; i++) {
            if (i !== Number(selectedItem)) {
                tempItems.push(items[i])
            }
        }
        setItems((items) => tempItems);
        localStorage.setItem("items", JSON.stringify(tempItems));

    }

    const switchFunc = (func) => {
        setActiveFunc((activeFunc) => func);
        clearForm();

    }



    useEffect(() => {
        if (loaded == false) {
            if (localStorage.getItem("items")) {
                setItems((items) => JSON.parse(localStorage.getItem("items")));
            }
            setLoaded((loaded) => true);
        }
    });




    return (<div className="row">
        <div className="col-md-12">
            <h2 className="my-3">Inventory</h2>

            <div className="btn-group form-control" role="group">
                <button className={activeFunc === "add" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("add")}>Add</button>
                <button className={activeFunc === "edit" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("edit")}>Edit</button>
                <button className={activeFunc === "delete" ? "btn btn-secondary active" : "btn btn-secondary"} onClick={() => switchFunc("delete")}>Delete</button>
            </div>
        </div>
        {items.length > 0 && activeFunc !== "add" ?
            <div className="col-md-12 my-2">
                <ItemSelector populateFields={populateFields} />
            </div>
            : null}
        {activeFunc !== "delete" ?
            <div className="col-md-12">
                <ul className="list-unstyled">
                    <li>
                        <input type="text" placeholder="Item Name" name="itemName" className="form-control" />
                    </li>
                    <input type="text" placeholder="Quantity in stock" name="stockQty" className="form-control" />
                    <li>
                        <input type="text" placeholder="Item Price" name="price" className="form-control" maxLength="10" />
                    </li>
                    <li><input type="text" placeholder="Item Category" name="category" className="form-control" maxLength="50" /></li>
                    <li>
                        <textarea name="details" placeholder="Item Details" className="form-control" rows="5" maxLength="500"></textarea>
                    </li>
                    {activeFunc === "add" ? <li><button className="btn btn-danger btn-block" onClick={() => addItem()}>Add Item</button></li> :
                        <li><button className="btn btn-danger btn-block" onClick={() => editItem()}>Edit Item</button></li>}
                </ul>
            </div> :
            <div className="col-md-12">

                {toggle !== "deleteItem" ? <button className="btn btn-block btn-danger" onClick={() => setToggle((toggle) => "deleteItem")}>Delete Item</button> :
                    <div className="alert alert-danger" role="alert">
                        <p>Are you sure you want to delete this item?</p>
                        <button className="btn btn-warning" onClick={() => deleteItem()}>Yes</button>
                        <button className="btn btn-dark" onClick={() => setToggle((toggle) => "")}>No</button>
                    </div>}





            </div>}
    </div>)

}

export default CMS;

/*
 [
                    { itemName: "ice", price: 2.99, details: "5 lb bag" },
                    { itemName: "salt", price: 1.95, details: "1 lb bag" },
                    { itemName: "plates", price: 4.90, details: "12 paper" },
                    { itemName: "firewood", price: 6.25, details: "bundle cedar" },
                    { itemName: "matches", price: .99, details: "long stem 30 count" },
                    { itemName: "butter", price: 2.45, details: "4 cups" },
                    { itemName: "yogurt", price: 3.99, details: "6 ounce blueberry" },
                    { itemName: "cottage cheese", price: 4.90, details: "6 ounce regular flavor" },
                    { itemName: "comb", price: 1.99, details: "6 inch plastic" },
                    { itemName: "sun glasses", price: 8.99, details: "women/men variety" }
                ]
*/