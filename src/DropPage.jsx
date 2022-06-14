import React from "react";
// import { ethers } from "ethers";
import "./styles/DropPage.css";

const DropPage = () => {
  const [currentAccount, setCurrentAccount] = React.useState("");

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
  return (
    <>
      <div className="quick--nav">
        {currentAccount && (
          <button className="waveButton" onClick={walletConnect}>
            <b>Connect Wallet</b>
          </button>
        )}
      </div>
      <div className="main--page">
        <h3>WELCOME TO MY SMART CONTRACT WAVER PROJECT</h3>
        <p className="">
          {" "}
          Hey I go by the name <b>Asap!</b>
          <br /> Wanna stand a chance to win some eth?
          <br className="brakes"/>
          Connect your Ethereum wallet and holla at me!
        </p>
      </div>
      <div className="main--section">
        <button className="waveButton" onClick={null}>
          <b> Continue</b>
        </button>
      </div>
    </>
  );
};

export default DropPage;
