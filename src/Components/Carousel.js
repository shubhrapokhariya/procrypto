import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "./CoinsTable";

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "center",
    // backgroundColor: "rgb(14,203,129)",
    marginTop: 10,
  },
  carouselItemblack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "white",
    fontSize: "15px",
  },
  carouselItemwhite: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "black",
    fontSize: "15px",
  },
  coinImage: {
    height: "40px",
    marginBottom: 10,
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      height: "28px",
    },
  },
  coinSymbol: {
    color: "darkgrey",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
  coinPercentage: {},
  coinPrice: {
    fontSize: "15px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
  },
}));

const Carousel = (props) => {
  const { check } = props;
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));

    console.log(trending);
    setTrending(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const classes = useStyles();

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link
        className={
          check ? classes.carouselItemblack : classes.carouselItemwhite
        }
        to={`/coins/${coin.id}`}
      >
        <img className={classes.coinImage} src={coin.image} alt={coin.name} />
        <span className={classes.coinSymbol}>
          {coin.symbol} &nbsp;
          <span
            className={classes.coinPercentage}
            style={{
              color: profit > 0 ? "rgb(0,202,181)" : "red",
            }}
          >
            {profit && "+"} {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </span>
        <span className={classes.coinPrice}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: { items: 2 },
    512: { items: 5 },
  };
  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
