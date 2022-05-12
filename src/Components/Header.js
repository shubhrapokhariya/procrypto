import {
  AppBar,
  Container,
  Select,
  Toolbar,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import logo from "./logo.svg";
import smallLogo from "./smallLogo.svg";
import moon from "./moon.svg";
import sun from "./sun.svg";
import smallMoon from "./smallMoon.svg";
import smallSun from "./smallSun.svg";
import AuthModal from "./Auth/AuthModal";
import UserSidebar from "./Auth/UserSidebar";

const useStyles = makeStyles((theme) => ({
  appbarblack: {
    backgroundColor: "black",
    color: "white",
    position: "static",
  },
  appbarwhite: {
    position: "static",
    backgroundColor: "white",
    color: "black",
  },
  titleblack: {
    flexGrow: 1,
    color: "white",
  },
  titlewhite: {
    flexGrow: 1,

    color: "black",
    [theme.breakpoints.down("xs")]: {
      flexGrow: "null",
    },
  },
  linkblack: {
    color: "white",
  },
  linkwhite: {
    color: "black",
  },
  metamask: {
    marginLeft: 10,
  },
  login: {
    marginLeft: 10,
  },
  logo_text: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
      display: "none",
    },
  },
  menu: {
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  logo: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  smalllogo: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
  largetoggle: {
    cursor: "pointer",
    marginLeft: 10,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  smalltoggle: {
    cursor: "pointer",
    marginLeft: 10,
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },
}));
const Header = (props, theme) => {
  const { check, change } = props;
  const classes = useStyles();

  const { currency, setCurrency, user } = CryptoState();

  return (
    <AppBar className={check ? classes.appbarblack : classes.appbarwhite}>
      <Container>
        <Toolbar style={{ marginLeft: "-20px" }}>
          <Link
            className={check ? classes.linkblack : classes.linkwhite}
            to="/"
          >
            <img className={classes.logo} src={logo} alt="logo" />
            <img className={classes.smalllogo} src={smallLogo} alt="logo" />
          </Link>
          <Typography
            className={check ? classes.titleblack : classes.titlewhite}
          >
            {" "}
            <Link
              className={check ? classes.linkblack : classes.linkwhite}
              to="/"
            >
              <span className={classes.logo_text}> PROCRYPTO</span>
            </Link>
          </Typography>
          <Select
            // variant="outlined"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value={"USD"}>
              <span className={classes.menu}> USD</span>
            </MenuItem>
            <MenuItem value={"EUR"}>
              <span className={classes.menu}> EUR</span>
            </MenuItem>
          </Select>

          <div className={classes.metamask}>
            <Link
              className={check ? classes.linkblack : classes.linkwhite}
              to="/donate"
            >
              <span className={classes.menu}> Donate</span>
            </Link>
          </div>
          <div className={classes.login}>
            {" "}
            <span className={classes.menu}>
              {" "}
              {user ? <UserSidebar /> : <AuthModal check={check} />}
            </span>
          </div>
          <div className={classes.largetoggle}>
            {check ? (
              <div checked={check} onClick={change}>
                <img src={sun} alt="sun" />
              </div>
            ) : (
              <div checked={check} onClick={change}>
                <img src={moon} alt="moon" />
              </div>
            )}
          </div>
          <div className={classes.smalltoggle}>
            {check ? (
              <div checked={check} onClick={change}>
                <img src={smallSun} alt="sun" />
              </div>
            ) : (
              <div checked={check} onClick={change}>
                <img src={smallMoon} alt="moon" />
              </div>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
