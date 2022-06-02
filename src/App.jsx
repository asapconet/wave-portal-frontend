import React, { useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [count, setCount] = React.useState("");
  const [waved, setWaved] = React.useState(false);
  const [minning, setMinning] = React.useState(false);
  const [allWaves, setAllWaves] = React.useState([]);

  // Message getter hook
  const enteredMessageRef = React.useRef();

  const contractAddress = "0x64b95D6b0a89016627b966154a95498974ddDbD4";

  const contractABI = abi.abi;

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
        //this struct is only needed in the frontend

        //THE FIRST METHOD TO MAP THE MASSAGES STORED ON THE ARRAY
        let wavesCleaned = waves.map((wave) => {
        	return {
        		address: wave.waver,
        		timestamp: new Date(wave.timestamp * 1000),
        		message: wave.message
        	};
        });

        //THE SECOND METHOD TO ASSIGN THE STRUCT TO AN ARRAY(FE)
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
  const wave = async (event) => {
    // preventDefault.event();
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
          'this message must be provided by any user not hard coded',
          // message,
          { gasLimit: 300000 }
        );
        setMinning(!minning);
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
  // console.log(count);

  useEffect(() => {
    walletCheck();
  }, []);
  // const wave = () => {};

  // stored items getter hook func
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
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>
        <div className="bio">
          I am Asap and I work with web2 & 3 simultaniosly that's pretty cool
          right? Connect your Ethereum wallet and holla at me!
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
  );
}
