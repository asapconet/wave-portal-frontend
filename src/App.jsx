import React, { useEffect } from "react";
import { ethers } from "ethers";
import "./styles/App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [count, setCount] = React.useState("");
  const [waved, setWaved] = React.useState(false);
  const [minning, setMinning] = React.useState(false);
  const [allWaves, setAllWaves] = React.useState([]);

  // Message getter hook
  const enteredMessageRef = React.useRef();

  const contractAddress = "0x744e33476C8Af411A0FBbfc55585dE2775843994";

  const contractABI = abi.abi;

  //func to check if the wallet is connect
  const walletCheck = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Please ensure you have metamask");
      } else {
        console.log("We have the etherium object lets go >>>", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts !== 0) {
        // getAllWaves();
        const newAccount = accounts[0];
        console.log("Here, found an authorized account:", newAccount);
        setCurrentAccount(newAccount);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // wallet connection logic
  const walletConnect = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get your metamask extention connected to browser");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // calling smart contract properly
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        // the real waver action
        const message = enteredMessageRef.current.value;
        const waveTransaction = await wavePortalContract.wave(
          // 'this message must be provided by any user not hard coded',
          message,
          { gasLimit: 300000 } //to avoid being overcharged
        );
        setMinning(!minning);
        console.log(message);
        console.log("Minning...", waveTransaction.hash);

        await waveTransaction.wait();
        setMinning(false);
        setWaved(!waved);
        console.log("Minned", waveTransaction.hash);

        const hits = await wavePortalContract.getTotalWaves();
        setCount(hits.toNumber());
        console.log(
          "We have gotton",
          "",
          hits.toNumber(),
          "",
          "humble donations"
        );
        return count;
      } else {
        console.log("ehtereum object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // this method gets all waves from the Contract
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        //the main mathod to get all the waves
        const waves = await wavePortalContract.getAllWaves();

        //THE FIRST METHOD TO MAP OUT THE MASSAGES,ADDY & TIMESTAMP FROM THE CONTRACT
        let wavesCleaned = waves.map((wave) => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        //THE SECOND METHOD TO ASSIGN THE FEATURES WE NEED ON THE FE TO AN ARRAY
        // let wavesCleaned = [];
        // waves.forEach((wave) => {
        //   wavesCleaned.push({
        //     address: wave.waver,
        //     timestamp: new Date(wave.timestamp * 1000),
        //     message: wave.message,
        //   });
        // });
        console.log(wavesCleaned);

        // for storing our data in the state
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ehtereum object does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    walletCheck();
  }, []);

  // this hook listens if their is any event emitted from smart contract
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
    }
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <>
      {currentAccount && (
        <button className="waveButton" onClick={walletConnect}>
          Connect Wallet
        </button>
      )}
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">👋 Hey there!</div>
          <div className="bio">
            Hi my name is Asap and I work with web2 & 3 simultaniosly that's
            pretty cool yhh. right? Connect your Ethereum wallet and holla at
            me!
            <p>
              So you can send me pretty much anything [link to your fav movie, a
              Message... something sweet] a stand a chance of getting 0.0001eth
              with love from me.
            </p>
          </div>
          <div className="msg--wave">
            <input
              id="message"
              type="text"
              placeholder={"spill out here ~kiki"}
              className="msg--box"
              ref={enteredMessageRef}
            />
            <button className="waveButton" onClick={wave}>
              Wave at Me
            </button>
          </div>
          {!currentAccount && (
            <button className="waveButton" onClick={walletConnect}>
              Connect Wallet
            </button>
          )}
          <span className="bio">
            {minning ? (
              <p>Your wave dropping in sec...</p>
            ) : (
              <p>
                Big thanks for prior waver!!! <br /> It's ok to wave more ;-)
              </p>
            )}
            <p>{waved && count + " waves in the bag so far..."}</p>
          </span>
          <span />
          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                className="msg--card"
                styles={{
                  backgroundColor: "OldLace",
                  marginTop: "16px",
                  padding: "8px",
                }}
              >
                <div>Address:{wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}{" "}
        </div>
      </div>
    </>
  );
}
