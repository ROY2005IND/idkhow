# VeriChain Supply - Smart Contracts

Smart contracts for VeriChain Supply, a decentralized supply chain tracking and product authentication platform.

## 📋 Overview

This directory contains three main Solidity smart contracts:

1. **AccessControl.sol** - Role-based access control management
2. **ProductRegistry.sol** - Product registration and management
3. **SupplyChainEvents.sol** - Supply chain event logging and tracking

## 🏗️ Smart Contract Architecture

### AccessControl.sol
Manages user roles and permissions across the platform.

**Roles:**
- `None` (0) - No role assigned
- `Admin` (1) - Full platform access
- `Manufacturer` (2) - Can register products
- `Distributor` (3) - Can log distribution events
- `Retailer` (4) - Can log retail events
- `Customer` (5) - Read-only access

**Key Functions:**
- `assignRole(address _user, Role _role)` - Assign role to user
- `getRole(address _user)` - Get user's current role
- `revokeRole(address _user)` - Remove user's role
- `hasPermission(address _user, Role _requiredRole)` - Check permissions

### ProductRegistry.sol
Handles product registration and retrieval.

**Product Structure:**
```solidity
struct Product {
    uint256 productId;
    string name;
    address manufacturer;
    uint256 createdAt;
    string batchNumber;
    bool exists;
    string description;
    string category;
}
```

**Key Functions:**
- `registerProduct(name, batchNumber, description, category)` - Register new product
- `getProduct(productId)` - Retrieve product details
- `getProductsByManufacturer(address)` - Get all products by manufacturer
- `getTotalProducts()` - Get total product count

### SupplyChainEvents.sol
Logs and tracks supply chain events for products.

**Event Types:**
- `Manufacturing` (0) - Product manufactured
- `Warehouse` (1) - Stored in warehouse
- `Shipping` (2) - In transit
- `Retail` (3) - At retail location
- `Customer` (4) - Delivered to customer

**Event Structure:**
```solidity
struct Event {
    uint256 eventId;
    uint256 productId;
    EventType eventType;
    string location;
    uint256 timestamp;
    address actor;
    string notes;
}
```

**Key Functions:**
- `addEvent(productId, eventType, location, notes)` - Log new event
- `getProductHistory(productId)` - Get all events for a product
- `getEvent(eventId)` - Get specific event details
- `getTotalEvents()` - Get total event count

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Configure Environment
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:
```env
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
```

## 🔨 Development

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm test
```

### Run Local Hardhat Node
```bash
npm run node
```

### Deploy Contracts

**Local Network:**
```bash
npm run deploy:local
```

**Polygon Mumbai Testnet:**
```bash
npm run deploy:mumbai
```

After deployment, save the contract addresses to your `.env` file.

## 🧪 Testing

The test suite covers:
- Role assignment and access control
- Product registration and retrieval
- Event logging and history tracking
- Permission checks and validations
- Edge cases and error handling

Run tests with:
```bash
npm test
```

## 📝 Contract Deployment Flow

1. Deploy `AccessControl` contract
2. Deploy `ProductRegistry` with AccessControl address
3. Deploy `SupplyChainEvents` with AccessControl and ProductRegistry addresses
4. Assign roles to users via AccessControl
5. Manufacturers can register products via ProductRegistry
6. Authorized users can log events via SupplyChainEvents

## 🌐 Network Configuration

### Local Development (Hardhat)
- Network: `localhost`
- Chain ID: `31337`
- RPC URL: `http://127.0.0.1:8545`

### Polygon Mumbai Testnet
- Network: `polygonMumbai`
- Chain ID: `80001`
- RPC URL: Configured in `.env`
- Gas Price: `20 Gwei`

## 🔐 Security Considerations

- Role-based access control prevents unauthorized actions
- Only manufacturers can register products
- Only authorized roles can add supply chain events
- Owner cannot have role revoked
- All state-changing functions emit events for tracking
- Product existence validated before event logging

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 🤝 Contributing

This is a college final year project. For questions or suggestions, please contact the project team.

## 📄 License

MIT License
