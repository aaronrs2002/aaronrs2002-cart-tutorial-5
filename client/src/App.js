
import React, { useState, useEffect } from "react";
import './App.css';
import Nav from "./components/Nav";
import Cart from "./components/Cart"
import PurchaseLog from './components/PurchaseLog';
import CMS from "./components/CMS";
import TimeSelector from "./components/TimeSelector";
import PurchasingChart from "./components/PurchasingChart";

function App() {
  let [loaded, setLoaded] = useState(false);
  let [activeModule, setActiveModule] = useState("cart");
  let [alert, setAlert] = useState("default");
  let [alertType, setAlertType] = useState("danger");
  //let [purchaseLog, setPurchaseLog] = useState([]);
  let [timeSelected, setTimeSelected] = useState([]);
  let [compareTime, setCompareTime] = useState("");
  const user = "this@email.com";




  const showAlert = (theMessage, theType) => {
    setAlertType((alertType) => theType);
    setAlert((alert) => theMessage);
    setTimeout(() => {
      setAlert((alert) => "default");
    }, 3000)
  }




  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  month = (Number(month) + 1);
  if (Number(month) < 10) {
    month = "0" + month;
  }
  let day = date.getDate();
  if (Number(day) < 10) {
    day = "0" + day;
  }

  let hours = date.getUTCHours();
  if (Number(hours) < 10) {
    hours = "0" + hours;
  }


  const timeSearch = () => {
    if (activeModule === "analytics") {
      document.querySelector("select[name='itemSelect']").selectedIndex = 0;

    }

    let selectYr = document.querySelector("select[name='purchaseYr']").value;
    let selectMo = document.querySelector("select[name='purchaseMo']").value;
    if (selectMo === "default") {
      selectMo = "";
    } else {
      selectMo = "-" + selectMo;
    }
    let selectDy = document.querySelector("select[name='purchaseDay']").value;
    if (selectMo === "default" || selectDy == "default") {
      selectDy = "";
    } else {
      selectDy = "-" + selectDy;
    }
    let selectHr = document.querySelector("select[name='purchaseHr']").value;
    if (selectMo === "default" || selectDy === "default" || selectHr == "default") {
      selectHr = "";

    } else {
      selectHr = "T" + selectHr + ":";
    }

    let tempTime = selectYr + selectMo + selectDy + selectHr;
    let tempPurchaseLog = [];
    let tempTimeSelected = [];
    console.log("tempTme: " + tempTime);

    if (localStorage.getItem("purchaseLog")) {
      tempPurchaseLog = JSON.parse(localStorage.getItem("purchaseLog"));
    }

    for (let i = 0; i < tempPurchaseLog.length; i++) {
      let tempId = tempPurchaseLog[i].saleId;
      if (tempId.substring(tempId.indexOf(":")).indexOf(tempTime) !== -1) {
        tempTimeSelected.push(tempPurchaseLog[i]);
      }
    }
    setTimeSelected((timeSelected) => tempTimeSelected);
    //setCompareTime((compareTime) => tempTime);
  }



  useEffect(() => {

    if (loaded === false) {
      if (localStorage.getItem("activeModule")) {
        setActiveModule((activeModule) => localStorage.getItem("activeModule"));
      }

      //setCompareTime((compareTime) => year + "-" + month + "-");
      setLoaded((loaded) => true);
    }


  })

  return (
    <React.Fragment>
      <Nav setActiveModule={setActiveModule} activeModule={activeModule} user={user} />
      {alert !== "default" ?
        <div className={"alert alert-" + alertType + " animated fadeInDown"} role="alert">{alert}</div>
        : null}
      <div className="container my-5">

        {activeModule === "cms" ? <CMS showAlert={showAlert} /> : null}
        {activeModule === "cart" ? <Cart showAlert={showAlert} user={user} /> : null}
        {activeModule === "log" || activeModule === "analytics" ? <TimeSelector timeSearch={timeSearch} year={year} month={month} /> : null}
        {activeModule === "log" ? <PurchaseLog timeSelected={timeSelected} /> : null}
        {activeModule === "analytics" ? <PurchasingChart timeSelected={timeSelected} /> : null}
      </div>
    </React.Fragment>
  );
}

export default App;
