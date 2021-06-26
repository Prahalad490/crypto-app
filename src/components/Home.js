import React from "react";
import Herocard from "./HeroCards";
import SimpleTable from "./Stocktable";


const Home = () => {


    return(
        <div>
            <div>
                <Herocard/>
            </div>
            <div>
                <SimpleTable/>
            </div>
        </div>
    )
}

export default Home