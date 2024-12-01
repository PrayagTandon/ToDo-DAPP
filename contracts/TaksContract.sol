// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract TaskContract {
    enum Importance { Low, Medium, High }

    struct Task {
        uint256 id;
        address username;
        string taskText;
        Importance importance;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    event AddTask(address recipient, uint256 taskId, string taskText, Importance importance);
    event DeleteTask(uint256 taskId, bool isDeleted);

    function addTask(string memory taskText, Importance importance, bool isDeleted) external {
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, msg.sender, taskText, importance, isDeleted));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId, taskText, importance);
    }

    function getMyTasks() external view returns (Task[] memory) {
        uint256 counter = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        uint256 index = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                result[index] = tasks[i];
                index++;
            }
        }

        return result;
    }

    function deleteTask(uint256 taskId, bool isDeleted) external {
        if (taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }
}