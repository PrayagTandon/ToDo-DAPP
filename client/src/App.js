import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config.js';
import TaskAbi from './TaskContract.json';
const { ethers } = require("ethers");

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [importance, setImportance] = useState('Low');
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

        const processedTasks = allTasks.map((task) => ({
          id: task.id.toNumber(),
          taskText: task.taskText,
          importance: task.importance, // 0: Low, 1: Medium, 2: High
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
  }, []);

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
      importance,
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

        await TaskContract.addTask(task.taskText, task.importance, task.isDeleted);
        setInput('');
        setImportance('Low');
        getAllTasks();
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
        getAllTasks();
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
        <div className="flex justify-center items-center">
          <Button
            variant="contained"
            color="info"
            className="mt-10 text-2xl"
            onClick={connectWallet}
          >
            Connect 🦊 MetaMask Wallet ➡ Sepolia Testnet
          </Button>
        </div>
      ) : correctNetwork ? (
        <div className="App">
          <form className="flex flex-col items-center gap-4">
            <TextField
              id="outlined-basic"
              label="Task"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              variant="outlined"
              className="w-96"
            />
            <FormControl className="w-96">
              <InputLabel>Importance</InputLabel>
              <Select
                value={importance}
                onChange={(event) => setImportance(event.target.value)}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
              className="w-96"
            >
              Add Task
            </Button>
          </form>
          <ul className="mt-10">
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                importance={item.importance}
                onClick={deleteTask(item.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex justify-center items-center text-2xl font-bold">
          Connect to the Ethereum Sepolia Testnet and reload the page.
        </div>
      )}
    </div>
  );
}

export default App;
