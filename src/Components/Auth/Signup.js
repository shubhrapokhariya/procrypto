import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, TextField } from "@material-ui/core";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  signup_form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "10px 50px",
  },

  signup_button: {
    backgroundColor: "rgb(0,202,181)",
    "&:hover": {
      background: "rgb(162, 222, 212)",
    },
  },
}));

const Signup = ({ handleClose }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setAlert } = CryptoState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setAlert({
        open: true,
        message: `Sign Up Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        setAlert({
          open: true,
          message: "Email already in use",
          type: "error",
        });
      } else if (error.message.includes("internal-error")) {
        setAlert({
          open: true,
          message: "Password do not match",
          type: "error",
        });
      }
      //   else  setAlert({
      //     open: true,
      //     message: error.message,
      //     type: "error",
      //   });

      return;
    }
  };

  return (
    <Box className={classes.signup_form}>
      <TextField
        className={classes.signup_textfield}
        required
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        required
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        required
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        // fullWidth
      />
      <Button
        //variant="contained"
        // size="large"
        className={classes.signup_button}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
