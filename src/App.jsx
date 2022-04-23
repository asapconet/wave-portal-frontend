import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {
	const [currentAccount, setCurrentAccount] = React.useState('');
	const [count, setCount] = React.useState('');
	const [waved, setWaved] = React.useState(false);
	const [minning, setMinning] = React.useState(false);

	const contractAddress = '0xE125DEB727c3Af9DBedc7EB0df8D26b3939017ab';

	const contractABI = abi.abi;

	//func to check if the wallet is connect
	const walletCheck = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Please ensure you have metamask');
			} else {
				console.log('We have the etherium object lets go >>>', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts !== 0) {
				const newAccount = accounts[0];
				console.log('Here, found an authorized account:', newAccount);
				setCurrentAccount(newAccount);
			} else {
				console.log('No authorized account found');
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
				alert(
					'Get your metamask extention connected to browser'
				);
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});
			console.log('Connected', accounts[0]);
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
				const waveTransaction = await wavePortalContract.wave();
				setMinning(!minning);
				console.log('Minning...', waveTransaction.hash);

				await waveTransaction.wait();
				setMinning(false);
				setWaved(!waved);
				console.log('Minned', waveTransaction.hash);

				const hits = await wavePortalContract.getTotalWaves();
				setCount(hits.toNumber());
				console.log(
					'We have gotton',
					'',
					hits.toNumber(),
					'',
					'humble donations'
				);
				return count;
			} else {
				console.log('ehtereum object does not exist!');
			}
		} catch (error) {
			console.log(error);
		}
	};
	// console.log(count);

	useEffect(() => {
		walletCheck();
		// if (minning) {
		//   const time = setTimeout(() => {
		//     <>Minning...</>
		//   }, 2000)
		//   return () => clearTimeout(time)
		// } else {
		//   null
		// }
	}, []);
	// const wave = () => {};

	return (
		<div className="mainContainer">
			<div className="dataContainer">
				<div className="header">👋 Hey there!</div>

				<div className="bio">
					I am Asap and I work with web2 & 3 simultaniosly that's pretty cool
					right? Connect your Ethereum wallet and holla at me!
				</div>

				<button className="waveButton" onClick={wave}>
					Wave at Me
				</button>
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
					<p>{waved && count + ' waves in the bag so far...'}</p>
				</span>
			</div>
		</div>
	);
}
