# 🔗 VeriChain Supply

**Decentralized Supply Chain Tracking and Product Authentication Platform**

A blockchain-based supply chain management system built for transparency, traceability, and anti-counterfeiting. Final Year College Project.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-orange.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow.svg)](https://hardhat.org/)
[![Polygon](https://img.shields.io/badge/Network-Polygon-purple.svg)](https://polygon.technology/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [Development Phases](#development-phases)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

VeriChain Supply is a decentralized platform that leverages blockchain technology to create an immutable, transparent supply chain tracking system. It enables:

- **Product Registration**: Manufacturers register products on the blockchain
- **Event Logging**: Track products through manufacturing, warehousing, shipping, retail, and delivery
- **Authentication**: Verify product authenticity via QR codes
- **Transparency**: Complete visibility into product journey
- **Anti-Counterfeiting**: Immutable records prevent fake products

### Problem Statement

Traditional supply chains lack transparency, making it difficult to:
- Track product origins and journey
- Verify product authenticity
- Prevent counterfeiting
- Ensure quality and compliance
- Build consumer trust

### Solution

VeriChain Supply uses blockchain to create an immutable ledger of product history, ensuring:
- ✅ Complete traceability from source to consumer
- ✅ Tamper-proof records
- ✅ Real-time tracking
- ✅ Enhanced accountability
- ✅ Consumer confidence

---

## ✨ Features

### Phase 1 (Current) - Smart Contracts ✅

- ✅ **Role-Based Access Control**: Admin, Manufacturer, Distributor, Retailer, Customer roles
- ✅ **Product Registry**: Decentralized product registration with unique IDs
- ✅ **Event Tracking**: Immutable logging of supply chain events
- ✅ **Permission Management**: Secure role assignment and verification
- ✅ **Event History**: Complete product journey tracking

### Phase 2 (Upcoming) - Backend & Frontend

- 🔄 RESTful API for contract interaction
- 🔄 React-based user interface
- 🔄 MetaMask integration
- 🔄 QR code generation and scanning
- 🔄 User authentication (JWT)
- 🔄 Real-time product tracking dashboard
- 🔄 Analytics and reporting

---

## 🛠️ Tech Stack

### Blockchain Layer
- **Smart Contracts**: Solidity 0.8.20
- **Development Framework**: Hardhat
- **Testing**: Hardhat Test Framework
- **Network**: Polygon Mumbai (Testnet)
- **Libraries**: OpenZeppelin Contracts

### Backend (Planned)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Blockchain Integration**: Web3.js / Ethers.js
- **Database**: MongoDB
- **Authentication**: JWT

### Frontend (Planned)
- **Framework**: React 18
- **Blockchain**: Web3.js
- **UI Library**: Material-UI / Tailwind CSS
- **State Management**: Redux / Context API

---

## 📁 Project Structure

```
verichain-supply/
├── smart-contracts/          # Solidity smart contracts
│   ├── contracts/           # Smart contract source files
│   │   ├── AccessControl.sol
│   │   ├── ProductRegistry.sol
│   │   └── SupplyChainEvents.sol
│   ├── scripts/             # Deployment scripts
│   │   └── deploy.js
│   ├── test/                # Contract tests
│   │   └── VeriChainSupply.test.js
│   ├── hardhat.config.js    # Hardhat configuration
│   ├── .env.example         # Environment variables template
│   └── README.md
│
├── backend/                 # Node.js/Express API (Phase 2)
│   └── README.md
│
├── frontend/                # React frontend (Phase 2)
│   └── README.md
│
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System architecture
│   └── SETUP.md            # Setup instructions
│
├── .gitignore
└── README.md               # This file
```

---

## 📜 Smart Contracts

### 1. AccessControl.sol
Manages user roles and permissions across the platform.

**Roles:**
- `Admin` - Full platform access
- `Manufacturer` - Can register products
- `Distributor` - Can log distribution events
- `Retailer` - Can log retail events
- `Customer` - Read-only access

**Key Functions:**
```solidity
function assignRole(address _user, Role _role) external
function getRole(address _user) external view returns (Role)
function revokeRole(address _user) external
```

### 2. ProductRegistry.sol
Handles product registration and management.

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
```solidity
function registerProduct(...) external returns (uint256)
function getProduct(uint256 _productId) external view
function getProductsByManufacturer(address) external view
```

### 3. SupplyChainEvents.sol
Logs and tracks supply chain events for products.

**Event Types:**
- `Manufacturing` - Product manufactured
- `Warehouse` - Stored in warehouse
- `Shipping` - In transit
- `Retail` - At retail location
- `Customer` - Delivered to customer

**Key Functions:**
```solidity
function addEvent(...) external returns (uint256)
function getProductHistory(uint256 _productId) external view
function getEvent(uint256 _eventId) external view
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ installed
- npm or yarn package manager
- MetaMask browser extension
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd verichain-supply
   ```

2. **Install smart contract dependencies**
   ```bash
   cd smart-contracts
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your configuration
   ```

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Deploy to Mumbai testnet**
   ```bash
   npm run deploy:mumbai
   ```

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md)

---

## 🗓️ Development Phases

### ✅ Phase 1: Smart Contracts (COMPLETED)

- [x] Project structure setup
- [x] AccessControl contract
- [x] ProductRegistry contract
- [x] SupplyChainEvents contract
- [x] Hardhat configuration
- [x] Deployment scripts
- [x] Comprehensive tests
- [x] Documentation

### 🔄 Phase 2: Backend API (UPCOMING)

- [ ] Express.js API server
- [ ] Web3 integration
- [ ] Database setup
- [ ] Authentication system
- [ ] API endpoints
- [ ] QR code generation
- [ ] API documentation

### 🔄 Phase 3: Frontend (UPCOMING)

- [ ] React application setup
- [ ] MetaMask integration
- [ ] Product registration UI
- [ ] Event logging interface
- [ ] Product tracking dashboard
- [ ] QR code scanner
- [ ] Role-based UI components

### 🔄 Phase 4: Testing & Deployment (UPCOMING)

- [ ] Integration testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Testnet deployment
- [ ] User acceptance testing
- [ ] Documentation finalization

---

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md) - System design and component interactions
- [Setup Guide](docs/SETUP.md) - Detailed installation and configuration
- [Smart Contracts README](smart-contracts/README.md) - Contract documentation
- [API Documentation](backend/README.md) - Backend API reference (Phase 2)
- [Frontend Guide](frontend/README.md) - Frontend documentation (Phase 2)

---

## 🔐 Security

- Role-based access control at contract level
- Only authorized addresses can perform restricted actions
- Immutable blockchain storage
- Event logging for audit trails
- Input validation and error handling

**⚠️ Important**: This is a college project. Not audited for production use.

---

## 🧪 Testing

Run the complete test suite:

```bash
cd smart-contracts
npm test
```

Test coverage includes:
- Role assignment and permissions
- Product registration
- Event logging
- Access control validations
- Edge cases and error handling

---

## 🌐 Deployment

### Mumbai Testnet (Current)
- **Network**: Polygon Mumbai
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com

### Mainnet (Future)
Production deployment on Polygon Mainnet planned after thorough testing.

---

## 🤝 Contributing

This is a final year college project. Contributions, suggestions, and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Use Cases

1. **Pharmaceutical Industry**: Track medicine from manufacturing to pharmacy
2. **Food Supply Chain**: Ensure food safety and track origin
3. **Luxury Goods**: Prevent counterfeiting of high-value products
4. **Electronics**: Verify authenticity and track warranty
5. **Agriculture**: Farm-to-table traceability

---

## 🎓 Learning Outcomes

This project demonstrates:
- Blockchain development with Solidity
- Smart contract design patterns
- Decentralized application architecture
- Full-stack blockchain integration
- Supply chain domain knowledge

---

## 📧 Contact

**Project Team**: [Your Name/Team]  
**Institution**: [Your College/University]  
**Year**: Final Year Project 2024-2025

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) - Development framework
- [OpenZeppelin](https://openzeppelin.com/) - Secure contract libraries
- [Polygon](https://polygon.technology/) - Scalable blockchain network
- [Ethereum](https://ethereum.org/) - Blockchain platform

---

## 📊 Project Status

**Current Status**: Phase 1 Complete ✅  
**Last Updated**: January 2025  
**Next Milestone**: Backend API Development

---

<div align="center">

**Built with ❤️ using Blockchain Technology**

⭐ Star this repo if you find it helpful!

</div>
