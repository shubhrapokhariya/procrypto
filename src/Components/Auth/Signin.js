import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, TextField } from "@material-ui/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  signin_form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "10px 50px",
  },

  signin_button: {
    backgroundColor: "rgb(0,202,181)",
    "&:hover": {
      background: "rgb(162, 222, 212)",
    },
  },
}));

const Signin = ({ handleClose }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill all the Fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
      if (error.message.includes("wrong-password")) {
        setAlert({
          open: true,
          message: "wrong password",
          type: "error",
        });
      } else if (error.message.includes("user-not-found")) {
        setAlert({
          open: true,
          message: "User not found",
          type: "error",
        });
      }

      // else
      // setAlert({
      //   open: true,
      //   message: error.message,
      //   type: "error",
      // });

      return;
    }
  };

  return (
    <Box className={classes.signin_form}>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button className={classes.signin_button} onClick={handleSubmit}>
        Signin
      </Button>
    </Box>
  );
};

export default Signin;
