'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

const CONTRACT_ADDRESS = '0xC86CAD54Ba2F3F66d9Ee8256ecFE5a63d6eAeea7'; // Add your contract address here
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "buyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "TOKENS_PER_TBNB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Replace with actual ABI when available

export default function Home() {
  const [amount, setAmount] = useState('');
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState(null);
  const [formattedTBNBBalance, setFormattedTBNBBalance] = useState("Connect Wallet");
  const [formattedCanimalBalance, setFormattedCanimalBalance] = useState("Connect Wallet");
  
  const { data: tBNBBalance, refetch: refetchTBNBBalance } = useBalance({
    address,
  });

  const { data: canimalBalance, refetch: refetchCanimalBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { writeContract, data: buyTxData, isPending: isBuyPending } = useWriteContract();

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleBuy = () => {
    if (!amount) return;
    const value = parseEther(amount);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'buyTokens',
      args: [],
      value,
    });
  };
  const formatBalance = (balance) => {
    if (!balance) return "0";
    return Number(balance).toFixed(4);
  };
  useEffect(() => {
    if (isConnected) {
      setFormattedTBNBBalance(tBNBBalance ? formatBalance(tBNBBalance.formatted) : "0");
      setFormattedCanimalBalance(canimalBalance ? formatEther(canimalBalance) : "0");
    } else {
      setFormattedTBNBBalance("...");
      setFormattedCanimalBalance("...");
    }
  }, [isConnected, tBNBBalance, canimalBalance]);
  useEffect(() => {
    if (buyTxData) {
      setTxHash(buyTxData);
    }
  }, [buyTxData]);

  useEffect(() => {
    if (isTxSuccess) {
      refetchTBNBBalance();
      refetchCanimalBalance();
      setAmount('');
    }
  }, [isTxSuccess, refetchTBNBBalance, refetchCanimalBalance]);
  return (
   <div className="min-h-screen flex flex-col w-[90%] mx-auto ">

    <div className="relative flex flex-row justify-between bg-[#FFA6A6] z-0  rounded-lg p-1 mt-10 border-2 border-black shadow-lg">
      
    <div className="flex flex-row gap-2 -mt-10">

<img src="/img/monkey.webp" className="object-contain max-w-20"/>
<img src="/img/owl.webp" className="object-contain max-w-20"/>
<img src="/img/porcupine.webp" className="object-contain max-w-20"/>
<img src="/img/rabbit.webp" className="object-contain max-w-20"/>

</div>
      {/* font-[family-name:var(--bubblegum)]  */}
      <img src="/img/logo.png" className="object-contain mr-5"/>
      <div className=" flex flex-col justify-center">
      <ConnectButton/>
      </div>
    </div>
    <div className="flex flex-row mt-10">
      <div className="basis-1/2 ">
      <div className="font-[family-name:var(--bubblegum)] text-[3.5rem] text-[#CE7460] garis-luar">

      Canimal Token <br/> Project ICO
      </div>
      <div className="font-[family-name:var(--bubblegum)] text-[3rem] text-[#F5AA52] garis-luar">

      1 tBNB = 100 Canimal
      </div>
      <div className="font-[family-name:var(--bubblegum)] text-[1.5rem] ">
      *this is just test token and doesn’t have any financial value<br/>
      Get your free tBNB from faucet <a href="https://www.bnbchain.org/en/testnet-faucet" target="_blank" className="text-blue-600">here</a>
      </div>
      </div>
      <div className="basis-1/2 ">
      <div className="bg-[#FFA6A6] border-2 border-black rounded-lg mx-10 shadow-lg flex flex-col">
        <div className="flex flex-row justify-evenly font-[family-name:var(--bubblegum)] mt-2">
          <div className="flex flex-col justify-center">
          <img src="/img/rabbit.webp" className="object-contain max-w-20"/>
          You have <br/>
          {formattedCanimalBalance} <br/>
        
          Canimal <br/>
          </div>
          <div className="flex flex-col justify-center">
          <img src="/img/owl.webp" className="object-contain max-w-20"/>
          You have <br/>
          {formattedTBNBBalance} <br/>
              
          tBNB <br/>
          </div>
        </div>
        <div className="flex justify-center mt-5">

        <input 
                type='number' 
                className="w-52 border-2 border-black rounded-lg text-center" 
                placeholder="Enter tBNB amount" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!formattedTBNBBalance || isBuyPending || isTxLoading}
              />
        </div>
        <div className="flex justify-center mt-5">
        <button 
                className="garis-luar font-[family-name:var(--bubblegum)] border-2 border-black text-white text-[1.5rem] rounded-lg px-2 bg-[#CE7460]"
                onClick={handleBuy}
                disabled={!isConnected || isBuyPending || isTxLoading || !amount}
              >
                {isBuyPending || isTxLoading ? "Processing..." : "Buy Canimal Token"}
              </button>
               </div>
               {isTxSuccess && (
              <div className="flex justify-center mt-2 text-green-600  font-[family-name:var(--bubblegum)] ">
                Transaction successful!. <a href={`https://testnet.bscscan.com/tx/${txHash}`} target='_blank' className='text-blue-600'> see on BSCscan</a>
              </div>
            )}
        <div className="flex justify-center mt-2">
       or
        </div>
        <div className="flex justify-center my-2">
        <div className="garis-luar font-[family-name:var(--bubblegum)] border-2 border-black text-white text-[1.5rem] rounded-lg px-2 bg-[#80A9FF]">Earn on TON App</div>
        </div>
      </div>
      </div>
    </div>
   </div>
  );
}
