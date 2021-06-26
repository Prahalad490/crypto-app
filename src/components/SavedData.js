import React, { useContext } from "react";
import Herocard from "./HeroCards";
import StockContext from "../context/Context"
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom"


const SavedData = () => {

    const { savedData, setRefresh } = useContext(StockContext)

    function clickHandler(e){
        axios.delete(`${process.env.REACT_APP_BACKEND_DELETE_URI}`, { data: { symbol: e.target.value } });
        setRefresh(true)
    }


    return(
        <div>
            <Herocard/>
            <div className="table-container">
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        
                        <TableRow>
                            
                            <TableCell align="center" colSpan={5}>Stock Details Table</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {
                        savedData.map((row, index) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                            {row.name}
                            </TableCell>
                            <TableCell >{row.symbol}</TableCell>
                            <TableCell >{row.market_cap}</TableCell>
                            <TableCell >
                            <button  value={row.symbol} onClick={clickHandler} className="delete-button">
                                DELETE
                            </button>
                            </TableCell>
                            <TableCell >{row.price}<br></br>USD</TableCell>
                        </TableRow>
                        ))}
                        <TableRow>
                        
                        <TableCell TableCell align="center" colSpan={5}>
                            
                            <Link to="/" style={{textDecoration: "none"}}>
                                <Button  variant="contained" color="primary">
                                    Back
                                </Button>
                            </Link>
                        </TableCell>
                        
                        
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default SavedData;