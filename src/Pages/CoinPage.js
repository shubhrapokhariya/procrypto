import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import CoinDetail from "../Components/CoinDetail";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../Components/CoinsTable";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 40,
    marginLeft: 150,
    marginRight: 150,
    [theme.breakpoints.down("md")]: {
      marginTop: 15,
      marginLeft: 12,
      marginRight: 12,
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 15,
      marginLeft: 10,
      marginRight: 10,
    },
  },
  topmostcontainer: {
    display: "flex",
    marginBottom: 45,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  coin_name: {
    marginLeft: 10,
    marginRight: 40,
    fontWeight: "bold",
    fontSize: "20px",
    [theme.breakpoints.down("md")]: {
      marginTop: -10,
      marginBottom: 10,
    },
  },
  coin_description: {
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },

  topcontainer: {
    display: "flex",
  },
  stats_div: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  stats: {
    color: "darkgrey",
    fontSize: "13px",
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
  stats_value: {
    fontWeight: "bold",
    fontSize: "14px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
  toppart1: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  toppart2: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  toppart3: {
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  ath_date: {
    marginLeft: 5,
    fontSize: "13px",
    color: "rgb(112, 194, 131)",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
    },
  },
  atl_date: {
    marginLeft: 5,
    fontSize: "13px",
    color: "rgb(227, 89, 57)",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
    },
  },
  source: {
    fontStyle: "italic",
    marginTop: 10,
    fontSize: "12px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, user, setAlert, watchlist } = CryptoState();
  const classes = useStyles();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Added to the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Watchlist !`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchCoin();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!coin)
    return (
      <LinearProgress
        style={{ backgroundColor: "rgb(0,202,181)", marginTop: 2 }}
      />
    );
  const profit =
    coin?.market_data.price_change_percentage_24h_in_currency[
      currency.toLowerCase()
    ] > 0;
  const athprofit =
    coin?.market_data.ath_change_percentage[currency.toLowerCase()] > 0;
  const atlprofit =
    coin?.market_data.atl_change_percentage[currency.toLowerCase()] > 0;

  return (
    <div className={classes.container}>
      <div className={classes.topmostcontainer}>
        {" "}
        <img
          className={classes.coin_image}
          src={coin?.image.large}
          alt={coin?.name}
          height="25"
          style={{ marginBottom: 20 }}
        />
        <Typography className={classes.coin_name} style={{ display: "flex" }}>
          <span> {`${coin?.name} `}</span>
          <span
            style={{
              textTransform: "uppercase",
              marginLeft: 5,
            }}
          >
            {` (${coin?.symbol})`}
          </span>
        </Typography>
        <Typography variant="subtitle1" className={classes.coin_description}>
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Typography>
      </div>

      <div className={classes.topcontainer}>
        {" "}
        <div className={classes.toppart1}>
          {" "}
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Rank</Typography>
            <Typography className={classes.stats_value}>
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Current Price</Typography>
            <Typography className={classes.stats_value}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>24h Price Change</Typography>
            <Typography
              className={classes.stats_value}
              style={{
                color: profit > 0 ? "rgb(0, 202,181)" : "red",
              }}
            >
              {profit && "+"}
              {coin?.market_data.price_change_percentage_24h_in_currency[
                currency.toLowerCase()
              ].toFixed(2)}
              %
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Volume</Typography>

            <Typography className={classes.stats_value}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.total_volume[currency.toLowerCase()]
              )}
            </Typography>
          </span>
        </div>
        <div className={classes.toppart2}>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Market Cap</Typography>

            <Typography className={classes.stats_value}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>
              Circulating Supply
            </Typography>

            <Typography className={classes.stats_value}>
              {coin.market_data.circulating_supply == null
                ? "null"
                : numberWithCommas(coin.market_data.circulating_supply)}
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Total Supply</Typography>

            <Typography className={classes.stats_value}>
              {coin.market_data.total_supply == null
                ? "null"
                : numberWithCommas(coin.market_data.total_supply)}
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>Max Supply</Typography>

            <Typography className={classes.stats_value}>
              {coin.market_data.max_supply == null
                ? "null"
                : numberWithCommas(coin.market_data.max_supply)}
            </Typography>
          </span>
        </div>
        <div className={classes.toppart3}>
          {" "}
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>
              All Time Hight &nbsp;(ATH)
            </Typography>

            <Typography className={classes.stats_value}>
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.ath[currency.toLowerCase()])}
              <span className={classes.ath_date}>
                on{" "}
                {new Date(coin?.market_data.ath_date[currency.toLowerCase()])
                  .toDateString()
                  //.toLocaleDateString()
                  .split(" ")
                  .slice(1, 4)
                  .join(" ")}
              </span>
            </Typography>
          </span>{" "}
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>
              All Time Low &nbsp;(ATL)
            </Typography>

            <Typography className={classes.stats_value}>
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.atl[currency.toLowerCase()])}
              <span className={classes.atl_date}>
                on{" "}
                {new Date(coin?.market_data.atl_date[currency.toLowerCase()])
                  .toDateString()
                  .split(" ")
                  .slice(1, 4)
                  .join(" ")}
              </span>
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>
              Variance from ATH %
            </Typography>

            <Typography
              className={classes.stats_value}
              style={{
                fontStyle: "italic",
                color: athprofit > 0 ? "rgb(0, 202,181)" : "red",
              }}
            >
              {coin?.market_data.ath_change_percentage[
                currency.toLowerCase()
              ].toFixed(2)}
              %
            </Typography>
          </span>
          <span className={classes.stats_div}>
            <Typography className={classes.stats}>
              Variance from ATL %
            </Typography>

            <Typography
              className={classes.stats_value}
              style={{
                fontStyle: "italic",
                color: atlprofit > 0 ? "rgb(0, 202,181)" : "red",
              }}
            >
              {coin?.market_data.atl_change_percentage[
                currency.toLowerCase()
              ].toFixed(2)}
              %
            </Typography>
          </span>
        </div>
      </div>

      {user && (
        <div
          style={{
            margin: "25px 0px 5px 0px",
          }}
        >
          <Button
            variant="outlined"
            style={{
              padding: "5px ",
              backgroundColor: inWatchlist
                ? "rgb(222, 180, 175)"
                : "rgb(162, 222, 212)",
            }}
            onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
          >
            {inWatchlist ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      )}

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
      </span>
      <div>
        <CoinDetail coin={coin} />
      </div>
    </div>
  );
};

export default CoinPage;
