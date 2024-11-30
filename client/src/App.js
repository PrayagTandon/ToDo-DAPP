// App.js
import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config.js';
import TaskAbi from './TaskContract.json';
const { ethers } = require("ethers");

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        const allTasks = await TaskContract.getMyTasks();

        // Ensure tasks are properly structured
        const processedTasks = allTasks.map((task, index) => ({
          id: index,
          taskText: task.taskText,
          isDeleted: task.isDeleted,
        }));
        setTasks(processedTasks);
      } else {
        console.error("Ethereum object does not exist.");
      }
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []); // Prevent infinite loop by using an empty dependency array

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.error('Metamask not detected.');
        return;
      }
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // 11155111
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet.');
        return;
      }
      setCorrectNetwork(true);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask: ', error);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    const task = {
      taskText: input,
      isDeleted: false,
    };
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        await TaskContract.addTask(task.taskText, task.isDeleted);
        setInput('');
        getAllTasks(); // Refresh tasks after adding
      } else {
        console.error("Ethereum object does not exist.");
      }
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        await TaskContract.deleteTask(key, true);
        getAllTasks(); // Refresh tasks after deletion
      } else {
        console.error("Ethereum object does not exist.");
      }
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <div>
      {currentAccount === '' ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="contained"
            color="info"
            style={{ justifyContent: "center", margin: "50px", fontSize: "28px", fontWeight: "bold" }}
            onClick={connectWallet}
          >
            Connect 🦊 MetaMask Wallet ➡ Sepolia Testnet
          </Button>
        </div>
      ) : correctNetwork ? (
        <div className="App">
          <form style={{ margin: "20px 30px 20px" }}>
            <TextField
              id="outlined-basic"
              helperText="Enter a task then click the '+'"
              label="Task"
              style={{ margin: "0px 10px 30px" }}
              size="normal"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button
              variant="contained"
              color="info"
              style={{ fontSize: "28px", fontWeight: "bold" }}
              onClick={addTask}
            >
              +
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>Connect to the Ethereum Sepolia Testnet and reload the page.</div>
        </div>
      )}
    </div>
  );
}

export default App;
