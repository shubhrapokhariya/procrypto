import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { HistoricalChart } from "../config/api";
import { chartDays } from "../config/days";
import { CryptoState } from "../CryptoContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement
);

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 50,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CoinDetail = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(365);
  const { currency } = CryptoState();
  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div className={classes.container}>
      {!historicData ? (
        <CircularProgress
          style={{ color: "rgb(0,202,181)" }}
          size={150}
          thickness={1}
        />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              width: "100%",
              start: "right",
            }}
          >
            {chartDays.map((day) => (
              <button
                key={day.value}
                style={{ padding: "2px 10px  ", cursor: "pointer" }}
                onClick={() => {
                  setDays(day.value);
                }}
                selected={day.value === days}
              >
                {day.label}
              </button>
            ))}
          </div>
          <Line
            data={{
              labels: historicData.map((coin) => {
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1
                  ? time
                  : date.toDateString().split(" ").slice(1, 4).join(" ");
              }),

              datasets: [
                {
                  data: historicData.map((coin) => coin[1]),
                  label: `Price ( Past ${days} Days ) in ${currency}`,
                  borderColor: "rgb(0,202,181)",
                  //color: "darkgrey",
                },
              ],
            }}
            options={{
              gridlines: null,
              elements: {
                point: {
                  radius: 1,
                },
              },
              scales: {
                x: {
                  ticks: {
                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                    callback: function (val, index) {
                      // Hide every 2nd tick label
                      return index % 7 === 0 ? this.getLabelForValue(val) : "";
                    },
                    color: "darkgrey",
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    color: "darkgrey",
                  },
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default CoinDetail;
