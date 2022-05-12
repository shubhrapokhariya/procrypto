import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import CoinPage from "./Pages/CoinPage";
import Donate from "./Pages/Donate";
import Alert from "./Components/Auth/Alert";
import {
  makeStyles,
  createTheme,
  Paper,
  ThemeProvider,
} from "@material-ui/core";

const useStyles = makeStyles({
  app: {
    // color: "white",
    minHeight: "100vh",
  },
  paper: {
    minHeight: "100vh",
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const classes = useStyles();

  const theme = createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <div className={classes.app}>
            <Header check={darkMode} change={() => setDarkMode(!darkMode)} />

            <Routes>
              <Route path="/" element={<Home check={darkMode} />} exact />
              <Route path="/coins/:id" element={<CoinPage />} exact />
              <Route
                path="/donate"
                element={<Donate check={darkMode} />}
                exact
              />
            </Routes>
            <Alert />
          </div>
        </Paper>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
