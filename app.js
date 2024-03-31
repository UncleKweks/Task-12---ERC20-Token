import Web3 from "web3";

let web3;
let contract;
let account;

const MyTokenABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "totalSupply_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

async function connect() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      window.ethereum.on("accountsChanged", (accounts) => {
        account = accounts[0];
        document.getElementById("account").textContent = account;
      });

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MyTokenABI.networks[networkId];
      contract = new web3.eth.Contract(
        MyTokenABI.abi,
        deployedNetwork && deployedNetwork.address
      );

      document.getElementById("status").textContent = "Connected to MetaMask";
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error("No Web3 provider detected");
  }
}

async function getAccount() {
  if (!web3) {
    console.error("Web3 not initialized");
    return;
  }

  const accounts = await web3.eth.getAccounts();
  account = accounts[0];
  document.getElementById("account").textContent = account;
}

async function getBalance() {
  if (!contract || !account) {
    console.error("Contract or account not available");
    return;
  }

  const balance = await contract.methods.balanceOf(account).call();
  document.getElementById("balance").textContent = balance;
}

async function mintTokens() {
  if (!contract || !account) {
    console.error("Contract or account not available");
    return;
  }

  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;

  try {
    document.getElementById("transactionStatus").textContent =
      "Transaction in progress...";
    await contract.methods.mint(recipient, amount).send({ from: account });
    document.getElementById("transactionStatus").textContent =
      "Minting successful";
    document.getElementById("recipient").value = "";
    document.getElementById("amount").value = "";
  } catch (error) {
    document.getElementById("transactionStatus").textContent = "Minting failed";
    console.error(error);
  }
}

async function transferTokens() {
  if (!contract || !account) {
    console.error("Contract or account not available");
    return;
  }

  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("amount").value;

  try {
    document.getElementById("transactionStatus").textContent =
      "Transaction in progress...";
    await contract.methods.transfer(recipient, amount).send({ from: account });
    document.getElementById("transactionStatus").textContent =
      "Transaction successful";
    document.getElementById("recipient").value = "";
    document.getElementById("amount").value = "";
  } catch (error) {
    document.getElementById("transactionStatus").textContent =
      "Transaction failed";
    console.error(error);
  }
}
