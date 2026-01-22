# Smart Contract Usage Guide

This guide explains how to interact with VeriChain Supply smart contracts.

## Table of Contents

1. [Contract Addresses](#contract-addresses)
2. [AccessControl](#accesscontrol)
3. [ProductRegistry](#productregistry)
4. [SupplyChainEvents](#supplychainevents)
5. [Complete Workflow Example](#complete-workflow-example)
6. [Web3.js Integration](#web3js-integration)
7. [Common Errors](#common-errors)

## Contract Addresses

After deployment, save your contract addresses:

```
AccessControl: 0x...
ProductRegistry: 0x...
SupplyChainEvents: 0x...
```

## AccessControl

### Assign a Role

**Function:** `assignRole(address _user, Role _role)`

**Roles:**
- 0 = None
- 1 = Admin
- 2 = Manufacturer
- 3 = Distributor
- 4 = Retailer
- 5 = Customer

**Example (Hardhat Console):**
```javascript
const AccessControl = await ethers.getContractFactory("AccessControl");
const accessControl = await AccessControl.attach("YOUR_CONTRACT_ADDRESS");

// Assign Manufacturer role to an address
await accessControl.assignRole("0x1234...", 2);
```

**Example (Web3.js):**
```javascript
const accessControl = new web3.eth.Contract(ABI, contractAddress);

await accessControl.methods
  .assignRole("0x1234...", 2)
  .send({ from: ownerAddress });
```

### Get User Role

**Function:** `getRole(address _user)`

**Example:**
```javascript
const role = await accessControl.getRole("0x1234...");
console.log("User role:", role.toString());
```

### Check Permission

**Function:** `hasPermission(address _user, Role _requiredRole)`

**Example:**
```javascript
const hasPermission = await accessControl.hasPermission("0x1234...", 2);
console.log("Has permission:", hasPermission);
```

## ProductRegistry

### Register a Product

**Function:** `registerProduct(name, batchNumber, description, category)`

**Requirements:**
- Caller must have Manufacturer or Admin role
- Name and batch number cannot be empty

**Example:**
```javascript
const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
const productRegistry = await ProductRegistry.attach("YOUR_CONTRACT_ADDRESS");

const tx = await productRegistry.registerProduct(
  "Organic Green Tea",
  "BATCH-2025-001",
  "Premium organic green tea from Darjeeling",
  "Beverages"
);

const receipt = await tx.wait();
console.log("Product registered:", receipt);
```

**Retrieve Product ID from Event:**
```javascript
const event = receipt.logs.find(log => 
  log.fragment && log.fragment.name === 'ProductCreated'
);
const productId = event.args.productId;
console.log("Product ID:", productId.toString());
```

### Get Product Details

**Function:** `getProduct(uint256 _productId)`

**Example:**
```javascript
const product = await productRegistry.getProduct(1);

console.log({
  productId: product.productId.toString(),
  name: product.name,
  manufacturer: product.manufacturer,
  createdAt: new Date(product.createdAt.toNumber() * 1000),
  batchNumber: product.batchNumber,
  description: product.description,
  category: product.category
});
```

### Get Products by Manufacturer

**Function:** `getProductsByManufacturer(address _manufacturer)`

**Example:**
```javascript
const productIds = await productRegistry.getProductsByManufacturer("0x1234...");
console.log("Product IDs:", productIds.map(id => id.toString()));
```

### Get Total Products

**Function:** `getTotalProducts()`

**Example:**
```javascript
const total = await productRegistry.getTotalProducts();
console.log("Total products:", total.toString());
```

## SupplyChainEvents

### Add an Event

**Function:** `addEvent(productId, eventType, location, notes)`

**Event Types:**
- 0 = Manufacturing
- 1 = Warehouse
- 2 = Shipping
- 3 = Retail
- 4 = Customer

**Requirements:**
- Caller must have Manufacturer, Distributor, Retailer, or Admin role
- Product must exist
- Location cannot be empty

**Example:**
```javascript
const SupplyChainEvents = await ethers.getContractFactory("SupplyChainEvents");
const supplyChainEvents = await SupplyChainEvents.attach("YOUR_CONTRACT_ADDRESS");

// Manufacturing event
await supplyChainEvents.addEvent(
  1,                           // productId
  0,                           // eventType (Manufacturing)
  "Tea Factory, Darjeeling",   // location
  "Quality checked and packaged"
);

// Warehouse event
await supplyChainEvents.addEvent(
  1,
  1,                           // eventType (Warehouse)
  "Distribution Center, Mumbai",
  "Received in warehouse bay 3"
);

// Shipping event
await supplyChainEvents.addEvent(
  1,
  2,                           // eventType (Shipping)
  "In Transit to Delhi",
  "Loaded on truck XYZ-123"
);
```

### Get Product History

**Function:** `getProductHistory(uint256 _productId)`

**Example:**
```javascript
const history = await supplyChainEvents.getProductHistory(1);

history.forEach((event, index) => {
  console.log(`Event ${index + 1}:`);
  console.log("  ID:", event.eventId.toString());
  console.log("  Type:", getEventTypeName(event.eventType));
  console.log("  Location:", event.location);
  console.log("  Actor:", event.actor);
  console.log("  Time:", new Date(event.timestamp.toNumber() * 1000));
  console.log("  Notes:", event.notes);
  console.log();
});

function getEventTypeName(type) {
  const types = ["Manufacturing", "Warehouse", "Shipping", "Retail", "Customer"];
  return types[type];
}
```

### Get Specific Event

**Function:** `getEvent(uint256 _eventId)`

**Example:**
```javascript
const event = await supplyChainEvents.getEvent(1);
console.log(event);
```

## Complete Workflow Example

Here's a complete example of the product lifecycle:

```javascript
const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner, manufacturer, distributor, retailer] = await hre.ethers.getSigners();
  
  // Attach to deployed contracts
  const accessControl = await hre.ethers.getContractAt("AccessControl", "0x...");
  const productRegistry = await hre.ethers.getContractAt("ProductRegistry", "0x...");
  const supplyChainEvents = await hre.ethers.getContractAt("SupplyChainEvents", "0x...");
  
  // Step 1: Assign roles
  console.log("Assigning roles...");
  await accessControl.assignRole(manufacturer.address, 2); // Manufacturer
  await accessControl.assignRole(distributor.address, 3);  // Distributor
  await accessControl.assignRole(retailer.address, 4);     // Retailer
  
  // Step 2: Register product (as manufacturer)
  console.log("Registering product...");
  const registerTx = await productRegistry.connect(manufacturer).registerProduct(
    "Premium Coffee Beans",
    "BATCH-2025-COFFEE-001",
    "Arabica beans from Ethiopia",
    "Food & Beverages"
  );
  const registerReceipt = await registerTx.wait();
  const productId = 1; // First product
  
  // Step 3: Add manufacturing event
  console.log("Adding manufacturing event...");
  await supplyChainEvents.connect(manufacturer).addEvent(
    productId,
    0, // Manufacturing
    "Coffee Plantation, Ethiopia",
    "Beans harvested and roasted"
  );
  
  // Step 4: Add warehouse event (as distributor)
  console.log("Adding warehouse event...");
  await supplyChainEvents.connect(distributor).addEvent(
    productId,
    1, // Warehouse
    "Distribution Center, Addis Ababa",
    "Quality inspection passed"
  );
  
  // Step 5: Add shipping event
  console.log("Adding shipping event...");
  await supplyChainEvents.connect(distributor).addEvent(
    productId,
    2, // Shipping
    "In transit to India",
    "Export documentation complete"
  );
  
  // Step 6: Add retail event (as retailer)
  console.log("Adding retail event...");
  await supplyChainEvents.connect(retailer).addEvent(
    productId,
    3, // Retail
    "Coffee Shop, Mumbai",
    "Received and shelved"
  );
  
  // Step 7: Get complete product history
  console.log("\nProduct History:");
  const product = await productRegistry.getProduct(productId);
  console.log("Product:", product.name);
  console.log("Manufacturer:", product.manufacturer);
  console.log("Batch:", product.batchNumber);
  
  const history = await supplyChainEvents.getProductHistory(productId);
  history.forEach((event, i) => {
    const eventTypes = ["Manufacturing", "Warehouse", "Shipping", "Retail", "Customer"];
    console.log(`\n${i+1}. ${eventTypes[event.eventType]}`);
    console.log(`   Location: ${event.location}`);
    console.log(`   Actor: ${event.actor}`);
    console.log(`   Notes: ${event.notes}`);
  });
}

main().catch(console.error);
```

## Web3.js Integration

### Setup

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

// Contract ABIs (get from artifacts folder)
const AccessControlABI = require('./artifacts/contracts/AccessControl.sol/AccessControl.json').abi;
const ProductRegistryABI = require('./artifacts/contracts/ProductRegistry.sol/ProductRegistry.json').abi;
const SupplyChainEventsABI = require('./artifacts/contracts/SupplyChainEvents.sol/SupplyChainEvents.json').abi;

// Create contract instances
const accessControl = new web3.eth.Contract(AccessControlABI, "0x...");
const productRegistry = new web3.eth.Contract(ProductRegistryABI, "0x...");
const supplyChainEvents = new web3.eth.Contract(SupplyChainEventsABI, "0x...");
```

### Register Product

```javascript
async function registerProduct(from, name, batch, description, category) {
  const tx = await productRegistry.methods
    .registerProduct(name, batch, description, category)
    .send({ from, gas: 500000 });
  
  // Get product ID from event
  const event = tx.events.ProductCreated;
  return event.returnValues.productId;
}
```

### Add Event

```javascript
async function addSupplyChainEvent(from, productId, eventType, location, notes) {
  return await supplyChainEvents.methods
    .addEvent(productId, eventType, location, notes)
    .send({ from, gas: 300000 });
}
```

### Get Product History

```javascript
async function getProductHistory(productId) {
  const history = await supplyChainEvents.methods
    .getProductHistory(productId)
    .call();
  
  return history.map(event => ({
    eventId: event.eventId,
    productId: event.productId,
    eventType: event.eventType,
    location: event.location,
    timestamp: new Date(event.timestamp * 1000),
    actor: event.actor,
    notes: event.notes
  }));
}
```

## Common Errors

### "Only manufacturers can register products"
- **Cause:** The caller doesn't have Manufacturer or Admin role
- **Solution:** Assign the Manufacturer role using AccessControl.assignRole()

### "Product does not exist"
- **Cause:** Trying to add an event for a non-existent product
- **Solution:** Verify the product ID exists using productRegistry.productExists()

### "Unauthorized to add events"
- **Cause:** Caller doesn't have required role
- **Solution:** Assign appropriate role (Manufacturer, Distributor, Retailer, or Admin)

### "Only owner can perform this action"
- **Cause:** Non-owner trying to assign roles
- **Solution:** Use the contract owner's account

### "Insufficient funds for gas"
- **Cause:** Account doesn't have enough MATIC for transaction
- **Solution:** Get test MATIC from Mumbai faucet

## Gas Estimates

Based on test results:

| Operation | Gas Cost (avg) |
|-----------|---------------|
| Assign Role | ~48,320 |
| Register Product | ~279,127 |
| Add Event | ~240,574 |
| Revoke Role | ~26,255 |

**Note:** Gas costs may vary based on network congestion.

## Security Best Practices

1. **Always verify roles** before performing sensitive operations
2. **Validate product existence** before adding events
3. **Use event logs** for off-chain tracking
4. **Keep private keys secure** and never commit them
5. **Test thoroughly** on testnet before mainnet deployment

## Next Steps

- Integrate contracts into backend API
- Build frontend UI for interaction
- Add QR code generation for products
- Implement event notifications
- Create analytics dashboard

---

For more information, see the [main README](../README.md) or [Architecture documentation](ARCHITECTURE.md).
