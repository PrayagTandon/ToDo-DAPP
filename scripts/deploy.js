const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const TaskContract = await hre.ethers.getContractFactory("TaskContract");
    const taskContract = await TaskContract.deploy();

    console.log("TaskContract deployed to:", taskContract.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// const main = async () => {
//     const contractFactory = await ethers.getContractFactory('TaskContract');
//     const contract = await contractFactory.deploy();
//     await contract.deployed();

//     console.log("Contract deployed to: ", contract.address);
// }

// const runMain = async () => {
//     try {
//         await main();
//         process.exit(0);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

// runMain();