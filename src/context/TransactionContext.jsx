import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';
import react from 'react';

export const TransactionContext = react.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);

	const signer = provider.getSigner();

	const transactionContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer,
	);

	return transactionContract;
};

export const TransactionProvider = ({ children }) => {
	const [connectedAccount, setConnectedAccount] = useState('');
	const [formData, setFormData] = useState({
		addressTo: '',
		amount: '',
		keyword: '',
		message: '',
	});

	const [isLoading, setIsLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);

	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem('transactionCount'),
	);

	const handleChange = (e, name) => {
		setFormData(oldState => ({ ...oldState, [name]: e.target.value }));
	};

	const getAllTransactions = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');

			const transactionContract = getEthereumContract();

			const availableTransactions =
				await transactionContract.getAllTransactions();

			const structuredTransactions = availableTransactions.map(
				transaction => ({
					addressTo: transaction.receiver,
					addressFrom: transaction.sender,
					timestamp: new Date(
						transaction.timestamp.toNumber() * 1000,
					).toLocaleString(),
					message: transaction.message,
					keyword: transaction.keyword,
					amount: parseInt(transaction.amount._hex) / 10 ** 18,
				}),
			);

			setTransactions(structuredTransactions);
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const accounts = await ethereum.request({
				method: 'eth_requestAccounts',
			});
			setConnectedAccount(accounts[0]);
		} catch (err) {
			console.log(err);
			throw new Error('no eth object');
		}
	};

	const checkWalletIsConnected = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length) {
				setConnectedAccount(accounts[0]);
				getAllTransactions();
			} else {
				console.log('no account found');
			}
		} catch (error) {
			console.log(error);

			throw new Error('no eth object');
		}
	};

	const checkIfTransactionsExists = async () => {
		try {
			if (ethereum) {
				const transactionContract = getEthereumContract();
				const transactionCount =
					await transactionContract.getTransactionCount();

				window.localStorage.setItem('transactionCount', transactionCount);
			}
		} catch (error) {
			console.log(error);

			throw new Error('No ethereum object');
		}
	};

	const sendTransaction = async () => {
		try {
			if (!ethereum) return alert('Please install metamask');
			const { addressTo, amount, message, keyword } = formData;
			const transactionContract = getEthereumContract();
			const parseAmount = ethers.utils.parseEther(amount); //parse into gwei

			await ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: connectedAccount,
						to: addressTo,
						gas: '0x5208', //21000GWEI,
						value: parseAmount._hex,
					},
				],
			});

			const transactionHash = await transactionContract.addToBlockchain(
				addressTo,
				parseAmount,
				message,
				keyword,
			);

			setIsLoading(true);
			console.log(`Loading - ${transactionHash.hash}`);
			await transactionHash.wait();
			console.log(`Success - ${transactionHash.hash}`);
			setIsLoading(false);

			const transactionCount =
				await transactionContract.getTransactionCount();

			setTransactionCount(transactionCount.toNumber());

			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		checkWalletIsConnected();
		checkIfTransactionsExists();
	}, []);

	return (
		<TransactionContext.Provider
			value={{
				connectWallet,
				connectedAccount,
				handleChange,
				formData,
				setFormData,
				sendTransaction,
				transactions,
				isLoading,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
