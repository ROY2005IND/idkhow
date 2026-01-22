const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to", hre.network.name);
  console.log("Deploying VeriChain Supply Smart Contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "\n");

  console.log("1. Deploying AccessControl...");
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("✓ AccessControl deployed to:", accessControlAddress, "\n");

  console.log("2. Deploying ProductRegistry...");
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy(accessControlAddress);
  await productRegistry.waitForDeployment();
  const productRegistryAddress = await productRegistry.getAddress();
  console.log("✓ ProductRegistry deployed to:", productRegistryAddress, "\n");

  console.log("3. Deploying SupplyChainEvents...");
  const SupplyChainEvents = await hre.ethers.getContractFactory("SupplyChainEvents");
  const supplyChainEvents = await SupplyChainEvents.deploy(accessControlAddress, productRegistryAddress);
  await supplyChainEvents.waitForDeployment();
  const supplyChainEventsAddress = await supplyChainEvents.getAddress();
  console.log("✓ SupplyChainEvents deployed to:", supplyChainEventsAddress, "\n");

  console.log("=".repeat(60));
  console.log("Deployment Summary:");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("  AccessControl:      ", accessControlAddress);
  console.log("  ProductRegistry:    ", productRegistryAddress);
  console.log("  SupplyChainEvents:  ", supplyChainEventsAddress);
  console.log("=".repeat(60));

  console.log("\n📝 Save these addresses to your .env file:");
  console.log(`ACCESS_CONTROL_ADDRESS=${accessControlAddress}`);
  console.log(`PRODUCT_REGISTRY_ADDRESS=${productRegistryAddress}`);
  console.log(`SUPPLY_CHAIN_EVENTS_ADDRESS=${supplyChainEventsAddress}`);

  return {
    accessControl: accessControlAddress,
    productRegistry: productRegistryAddress,
    supplyChainEvents: supplyChainEventsAddress
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
