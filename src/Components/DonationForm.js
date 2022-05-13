import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import * as ethers from "ethers";
const useStyles = makeStyles((theme) => ({
  container: {
    // marginTop: 50,
    margin: "50px 10px 10px 10px",
    [theme.breakpoints.down("xs")]: {
      marginTop: 15,
    },
  },
  items: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    fontStyle: "italic",
    fontSize: "18px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "15px",
    },
  },

  donationForm: {
    margin: 20,
    display: "flex",
    flexDirection: "column",
  },

  walletDetail_divblack: {
    backgroundColor: "#595959",
    padding: "10px",
    border: "2px solid #666666",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,

    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      padding: "5px 10px",
    },
  },
  walletDetail_divwhite: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    border: "2px solid #d9d9d9",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      padding: "5px 10px",
    },
  },
  walletDetail_key_div: {
    marginRight: 15,
    [theme.breakpoints.down("xs")]: {
      marginRight: 0,
    },
  },
  walletDetail_keyblack: {
    fontSize: "11px",
    color: "white",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
    },
  },
  walletDetail_keywhite: {
    fontSize: "11px",
    color: "black",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px",
    },
  },
  walletDetail_value: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "rgb(0,202,181)",
    [theme.breakpoints.down("xs")]: {
      fontSize: "10px",
    },
  },
  form_divblack: {
    backgroundColor: "#595959",
    padding: "5px 40px",
    border: "1px solid #666666",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    cursor: "pointer",
  },
  form_divwhite: {
    backgroundColor: "#f2f2f2",
    padding: "5px 40px",
    border: "1px solid #d9d9d9",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
    cursor: "pointer",
  },
  errorMsg: { color: "rgb(227, 89, 57)", marginTop: 40, fontSize: "15px" },
  successMsg: {
    color: "rgb(112, 194, 131)",
    marginTop: 40,
    fontSize: "15px",
    fontStyle: "bold",
  },
}));

const DonationForm = (props) => {
  const { check } = props;
  const classes = useStyles();
  const [amount, setAmount] = useState(0);
  const walletAddress = "0x4854AB96Bcc5665Ee1d2b860A4E8640B62B0fAB5";
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [switchButton, setSwitchButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setSwitchButton(true);
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        const bal = ethers.utils.formatEther(balance);
        setUserBalance(parseFloat(bal).toFixed(5));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const sendDonation = async (e) => {
    e.preventDefault();

    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }
      await window.ethereum.send("eth_requestAccounts");

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      ethers.utils.getAddress(walletAddress);

      const transactionResponse = await signer.sendTransaction({
        to: walletAddress,

        value: ethers.utils.parseEther(amount.toString()),
      });

      console.log({ transactionResponse });
      setSuccessMessage("Successfully paid, THANK YOU! ");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");

      if (
        error.message ===
        "MetaMask Tx Signature: User denied transaction signature."
      ) {
        setErrorMessage("User denied transaction!");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        setErrorMessage(
          "We appreciate your geneorisity but you have 'Insufficient Funds'!"
        );
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <div>
          Give your contribution in whichever coin and chain you are
          comfortable!
        </div>
        <div
          className={
            check
              ? classes.walletDetail_divblack
              : classes.walletDetail_divwhite
          }
        >
          <div className={classes.walletDetail_key_div}>
            <span
              className={
                check
                  ? classes.walletDetail_keyblack
                  : classes.walletDetail_keywhite
              }
            >
              Address:
            </span>{" "}
            <span className={classes.walletDetail_value}>{defaultAccount}</span>
          </div>

          <div>
            <span
              className={
                check
                  ? classes.walletDetail_keyblack
                  : classes.walletDetail_keywhite
              }
            >
              Balance:
            </span>{" "}
            <span className={classes.walletDetail_value}>{userBalance}</span>
          </div>
        </div>
        <div className={classes.donationForm}>
          <input
            className={check ? classes.form_divblack : classes.form_divwhite}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(Number.parseFloat(e.target.value));
            }}
          />
          <input type="hidden" placeholder="Address" value={walletAddress} />
          {!switchButton ? (
            <button
              className={check ? classes.form_divblack : classes.form_divwhite}
              style={{ cursor: "pointer", justifyContent: "center" }}
              onClick={connectWalletHandler}
            >
              connect wallet
            </button>
          ) : (
            <button
              style={{ justifyContent: "center" }}
              className={check ? classes.form_divblack : classes.form_divwhite}
              onClick={sendDonation}
              disabled={!amount}
            >
              Pay
            </button>
          )}

          {errorMessage && (
            <div className={classes.errorMsg}>{errorMessage}</div>
          )}
          {successMessage && (
            <div className={classes.successMsg}>{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationForm;

/// 32000 - insufficient funds
/// 4001 - user denied
