import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  LinearProgress,
  //TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles((theme) => ({
  bodyrowblack: {
    backgroundColor: "#424242",

    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#535555",
    },
    fontFamily: "Montserrat",
  },
  bodyrowwhite: {
    backgroundColor: "white",

    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#E8EFEF",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "rgb(0,202,181)",
    },
  },
  heading: {
    marginTop: 60,
    marginBottom: 25,

    fontSize: 18,
    [theme.breakpoints.down("xs")]: {
      marginTop: 30,
      marginBottom: -15,
      fontSize: 14,
    },
  },
  coinImage: {
    height: "30px",
    [theme.breakpoints.down("xs")]: {
      height: "20px",
    },
  },
  coinName: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  coinSymbol: {
    color: "darkgrey",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  tableCell: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  source: {
    fontStyle: "italic",

    fontSize: "12px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
}));

const CoinsTable = (props) => {
  const { check } = props;
  const search = "";
  // const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { currency, symbol, coins, loading, fetchCoinsData } = CryptoState();
  const classes = useStyles();
  const navigate = useNavigate();

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  useEffect(() => {
    fetchCoinsData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <Container>
      <Typography className={classes.heading}>
        Market Trend &nbsp; &nbsp;
        <span className={classes.source}>
          source:{" "}
          <a
            style={{
              color: "rgb(0,202,181)",
              cursor: "pointer",
              fontStyle: "italic",
            }}
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            coingecko
          </a>
        </span>{" "}
      </Typography>

      <TableContainer>
        {loading ? (
          <LinearProgress style={{ backgroundColor: "rgb(0,202,181)" }} />
        ) : (
          <Table style={{ marginBottom: 20 }}>
            <TableHead>
              <TableRow>
                {[
                  "Coin",
                  "Price",
                  "24h Change",
                  "24h Range",
                  "24h Range %",
                  "Volume (Vol)",
                  "Market Cap (MC)",
                  "Vol/MC",
                ].map((head) => (
                  <TableCell
                    className={classes.tableCell}
                    style={{ color: "darkgrey" }}
                    key={head}
                    align={head === "Coin" ? "" : "right"}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((coin) => {
                  const profit = coin.price_change_percentage_24h > 0;

                  return (
                    <TableRow
                      onClick={() => navigate(`/coins/${coin.id}`)}
                      className={
                        check ? classes.bodyrowblack : classes.bodyrowwhite
                      }
                      key={coin.name}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          display: "flex",
                          gap: 15,
                        }}
                      >
                        <img
                          className={classes.coinImage}
                          src={coin.image}
                          alt={coin.name}
                        />
                        <div>
                          <span className={classes.coinName}>{coin.name}</span>
                          <span className={classes.coinSymbol}>
                            {coin.symbol}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {" "}
                        {symbol}{" "}
                        {numberWithCommas(coin.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        align="right"
                        style={{
                          color: profit > 0 ? "rgb(0, 202,181)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        align="right"
                        style={{
                          color: profit > 0 ? "rgb(0, 202,181)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {(coin.high_24h - coin.low_24h).toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        align="right"
                        style={{
                          color: profit > 0 ? "rgb(0, 202,181)" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {(
                          (coin.high_24h - coin.low_24h) /
                          coin.current_price
                        ).toFixed(2)}
                        %
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
                        {" "}
                        {symbol}{" "}
                        {numberWithCommas(
                          coin.total_volume.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">
                        {symbol}{" "}
                        {numberWithCommas(
                          coin.market_cap.toString().slice(0, -6)
                        )}
                        M
                      </TableCell>
                      <TableCell
                        className={classes.tableCell}
                        align="right"
                        style={{
                          color: "rgb(0, 202,181)",
                        }}
                      >
                        {numberWithCommas(
                          ((coin.total_volume / coin.market_cap) * 100).toFixed(
                            2
                          )
                        )}
                        %
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Pagination
        count={(handleSearch()?.length / 10).toFixed(0)}
        style={{
          padding: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        classes={{ ul: classes.pagination }}
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 250);
        }}
      />
    </Container>
  );
};

export default CoinsTable;
