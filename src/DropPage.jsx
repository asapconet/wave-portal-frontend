import React from "react";
import "./styles/DropPage.css";

const DropPage = () => {
  return (
    <>
      <div className="quick--nav">
        <button className="waveButton" onClick={null}>
          <b>Connect Wallet</b>
        </button>
      </div>
      <div className="main--page">
        <h3>WELCOME TO MY SMART CONTRACT WAVER PROJECT</h3>
        <p className="">
          {" "}
          Hi my name is <b>Asap!</b>
          <br /> Wanna stand a chance to win some eth?
          <br />
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
