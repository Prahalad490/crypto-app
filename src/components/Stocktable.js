import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import StockContext from "../context/Context";
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom"

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});



export default function SimpleTable() {

  const { savedData, setRefresh } = useContext(StockContext);

  const [ stockDatas , setStockData ] = useState([]);


  const [ search, setSearch] = useState("");


  useEffect(() => {

    async function fetchData(){

      const res = await axios.get(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_API_KEY}&per-page=276`);
      
      const modifieData = await res.data.map(item => ({...item, saved_status:false}))

      const compareData = modifieData.map((data) => {

        
        var result = savedData.filter(item => item.symbol === data.symbol);
        if(result.length>0) {
          data.saved_status = result[0].saved_status
        }

        return data
        

      })
      console.log(compareData)
      setStockData(modifieData)
    }

    fetchData()
    setRefresh(false)
  },[savedData, setRefresh ])


  function clickHandler(e){

    e.preventDefault();
    console.log(e.target)

    stockDatas.map(item => {
      
      return(
        item.symbol === e.target.value &&
        axios.post(`${process.env.REACT_APP_BACKEND_SAVE_DATA_URI}`, { 
          name: item.name,
          symbol: item.symbol,
          market_cap: item.market_cap,
          saved_status: true,
          price: item.price
        })
      )
    })

    setRefresh(true)

  }

  



  const searchHandler = async(e) => {
    setSearch(e.target.value); 
  }



  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, stockDatas.length - page * rowsPerPage);

  function kFormat(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }


  
  return (
    <div className="table-container">
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell>Stock Details Table</TableCell>
                <TableCell align="left" colSpan={4}>
                    <input name="search" value={search} onChange={searchHandler} autoComplete="off" placeholder="search"></input>
                </TableCell>
            </TableRow>
          <TableRow>
            <TableCell align="center">CURRENCY NAME</TableCell>
            <TableCell align="center">SYMBOL</TableCell>
            <TableCell align="center">MARKET CAP</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">CURRENT PRICE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockDatas.filter(li=> 
                      li.name.toLowerCase().includes(search.toLowerCase()) ||
                      li.symbol.toString().toLowerCase().includes(search.toLowerCase()) ||
                      li.market_cap.toLowerCase().includes(search.toLowerCase()) ||
                      li.price.toLowerCase().includes(search.toLowerCase())
                  )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row" align="center">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.symbol}</TableCell>
                <TableCell align="center">{kFormat(row.market_cap)}</TableCell>
                <TableCell align="center">
                  
                  {row.saved_status ? (
                    <Link to="/view" style={{textDecoration: "none"}}><Button variant="contained" color="primary">
                      VIEW
                    </Button></Link>) 
                    : <button onClick={clickHandler} value={row.symbol} className="save-button">
                        Save Data
                      </button>
                  }
                  
                </TableCell>
                <TableCell align="center">{Math.abs(row.price)}<br></br>USD</TableCell>
              </TableRow>
            ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={stockDatas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </TableContainer>
    </div>
  );
}
