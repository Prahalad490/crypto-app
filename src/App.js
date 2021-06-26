import React, { useEffect, useState } from "react";
import stockContext from "./context/Context"
import axios from "axios";
import Home from "./components/Home";
import "./app.css"
import SavedData from "./components/SavedData";
import {BrowserRouter as Router, Route} from "react-router-dom";

function App() {

  
  const [heroStock, setHeroStock] = useState([]);
  const [ savedData, setSavedData] = useState([]);
  const [ refresh, setRefresh] = useState(false);

  useEffect(() => {

    async function fetchData(){

      const APIreponseData = await axios.get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_API_KEY}&ids=FTXGOOGL,FTXFB,AMZNCX`);
      
      
      setHeroStock(APIreponseData.data)
      console.log(APIreponseData.data)

    }

    fetchData()
    setRefresh(true)
  },[])


  useEffect(() => {

    async function fetchData(){

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_GET_DATA_URI}`);
      setSavedData(res.data)
    
    }

    fetchData()
    setRefresh(false)
  },[refresh])
  


  return (
    <stockContext.Provider value={{heroStock, savedData, refresh, setRefresh}}>
      <Router>

        <Route path="/" exact>
          <Home/>
        </Route>

        <Route path="/view">
          <SavedData/>
        </Route>

      </Router>
    </stockContext.Provider>
  );
}

export default App;
