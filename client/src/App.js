import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config.js';
import TaskAbi from './TaskContract.json';
import NotebookHeader from './notebook-header.jpg';
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
          id: task.id,
          taskText: task.taskText,
          importance: task.importance,
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
    const importanceMap = {
      Low: 0,
      Medium: 1,
      High: 2,
    };
    const task = {
      taskText: input,
      importance: importanceMap[importance],
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
    <div className="app-container flex flex-col items-center">
      {currentAccount === '' ? (
        <Button
          variant="contained"
          color="info"
          className="connect-button"
          onClick={connectWallet}
        >
          Connect 🦊 MetaMask Wallet ➡ Sepolia Testnet
        </Button>
      ) : correctNetwork ? (
        <div className="notebook">
          <img src={NotebookHeader} alt="Notebook Header" className="header-image" />
          <h1 className="to-do-heading">To-Do List</h1>
          <form className="form-container">
            <TextField
              id="outlined-basic"
              label="Task"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              variant="outlined"
              className="task-input"
            />
            <FormControl className="importance-select">
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
              className="add-button"
            >
              Add Task
            </Button>
          </form>
          <ul className="task-list">
            {tasks.map((task) => (
              <Task
                key={task.id}
                taskText={task.taskText}
                importance={task.importance}
                onClick={deleteTask(task.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="text-xl font-bold">Connect to Sepolia Testnet</div>
        </div>
      )}
    </div>
  );
}

export default App;
