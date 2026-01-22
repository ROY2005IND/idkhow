# VeriChain Supply - Project Structure

## Directory Tree

```
verichain-supply/
│
├── smart-contracts/              # Blockchain smart contracts (Phase 1 ✅)
│   ├── contracts/               # Solidity smart contracts
│   │   ├── AccessControl.sol   # Role-based access control
│   │   ├── ProductRegistry.sol # Product registration & management
│   │   └── SupplyChainEvents.sol # Event logging & tracking
│   │
│   ├── scripts/                 # Deployment scripts
│   │   └── deploy.js           # Main deployment script
│   │
│   ├── test/                    # Test files
│   │   └── VeriChainSupply.test.js # Comprehensive test suite
│   │
│   ├── hardhat.config.js        # Hardhat configuration
│   ├── package.json             # Dependencies and scripts
│   ├── .env.example             # Environment variables template
│   └── README.md                # Smart contracts documentation
│
├── backend/                     # Node.js/Express API (Phase 2 🔄)
│   └── README.md                # Backend documentation (placeholder)
│
├── frontend/                    # React application (Phase 2 🔄)
│   └── README.md                # Frontend documentation (placeholder)
│
├── docs/                        # Project documentation
│   ├── ARCHITECTURE.md          # System architecture & design
│   ├── SETUP.md                 # Setup & installation guide
│   └── SMART_CONTRACT_USAGE.md # Contract usage examples
│
├── .gitignore                   # Git ignore rules
├── LICENSE                      # MIT License
├── README.md                    # Main project documentation
├── PHASE1_COMPLETION.md         # Phase 1 completion report
├── PROJECT_STRUCTURE.md         # This file
└── package.json                 # Root package configuration
```

## File Descriptions

### Root Level Files

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Main project documentation with overview, features, and setup | ✅ Complete |
| `LICENSE` | MIT License for the project | ✅ Complete |
| `.gitignore` | Git ignore patterns for Node, build files, secrets | ✅ Complete |
| `package.json` | Root workspace configuration and scripts | ✅ Complete |
| `PHASE1_COMPLETION.md` | Phase 1 deliverables report | ✅ Complete |
| `PROJECT_STRUCTURE.md` | This file - project structure documentation | ✅ Complete |

### Smart Contracts Directory

#### Contracts (`smart-contracts/contracts/`)

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `AccessControl.sol` | 61 | Role-based access control with 6 roles | ✅ Deployed & Tested |
| `ProductRegistry.sol` | 114 | Product registration and management | ✅ Deployed & Tested |
| `SupplyChainEvents.sol` | 139 | Supply chain event logging | ✅ Deployed & Tested |

#### Scripts (`smart-contracts/scripts/`)

| File | Purpose | Status |
|------|---------|--------|
| `deploy.js` | Deploy all contracts in correct order | ✅ Complete |

#### Tests (`smart-contracts/test/`)

| File | Tests | Coverage | Status |
|------|-------|----------|--------|
| `VeriChainSupply.test.js` | 15 tests | 100% | ✅ All Passing |

#### Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `hardhat.config.js` | Hardhat & network configuration | ✅ Complete |
| `package.json` | Dependencies and npm scripts | ✅ Complete |
| `.env.example` | Environment variables template | ✅ Complete |
| `README.md` | Smart contracts documentation | ✅ Complete |

### Documentation Directory

| File | Pages | Purpose | Status |
|------|-------|---------|--------|
| `ARCHITECTURE.md` | ~300 lines | System architecture, data flow, security | ✅ Complete |
| `SETUP.md` | ~250 lines | Installation, setup, troubleshooting | ✅ Complete |
| `SMART_CONTRACT_USAGE.md` | ~450 lines | Contract usage, examples, integration | ✅ Complete |

### Backend Directory (Phase 2)

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Backend API documentation and roadmap | 🔄 Placeholder |

**Planned Structure:**
```
backend/
├── src/
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── app.js           # Express app
├── tests/               # API tests
├── .env.example         # Environment template
└── package.json         # Dependencies
```

### Frontend Directory (Phase 2)

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Frontend documentation and roadmap | 🔄 Placeholder |

**Planned Structure:**
```
frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── contracts/       # Contract ABIs
│   ├── utils/           # Web3 utilities
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context providers
│   └── App.js           # Main app
├── public/              # Static assets
└── package.json         # Dependencies
```

## Key Technologies

### Phase 1 (Complete)
- **Solidity** 0.8.20 - Smart contract language
- **Hardhat** 2.28.3 - Development framework
- **OpenZeppelin** 5.4.0 - Contract libraries
- **Chai** - Testing framework
- **Ethers.js** - Ethereum library
- **Polygon Mumbai** - Testnet deployment

### Phase 2 (Planned)
- **Node.js** 18+ - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **React** 18 - Frontend framework
- **Web3.js** - Blockchain integration
- **Material-UI** - UI components
- **JWT** - Authentication

## Scripts Available

### Root Level
```bash
npm run contracts:install     # Install smart contract dependencies
npm run contracts:compile     # Compile smart contracts
npm run contracts:test        # Run smart contract tests
npm run contracts:deploy:local    # Deploy to local network
npm run contracts:deploy:mumbai   # Deploy to Mumbai testnet
npm run contracts:node        # Start local Hardhat node
```

### Smart Contracts Directory
```bash
cd smart-contracts
npm run compile              # Compile contracts
npm test                     # Run tests
npm run deploy:local         # Deploy locally
npm run deploy:mumbai        # Deploy to testnet
npm run node                 # Start local node
npm run clean                # Clean artifacts
```

## Development Workflow

### Current (Phase 1)
1. Edit smart contracts in `contracts/`
2. Run `npm run compile` to compile
3. Run `npm test` to verify tests pass
4. Deploy with `npm run deploy:mumbai`
5. Update `.env` with contract addresses

### Next (Phase 2)
1. Initialize backend in `backend/`
2. Initialize frontend in `frontend/`
3. Integrate with deployed contracts
4. Build API and UI
5. End-to-end testing

## Environment Variables

### Smart Contracts (`.env`)
```env
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key
ACCESS_CONTROL_ADDRESS=deployed_address
PRODUCT_REGISTRY_ADDRESS=deployed_address
SUPPLY_CHAIN_EVENTS_ADDRESS=deployed_address
```

### Backend (`.env` - Planned)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/verichain
JWT_SECRET=your_jwt_secret
POLYGON_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESSES=...
```

### Frontend (`.env` - Planned)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_NETWORK_ID=80001
REACT_APP_NETWORK_NAME=Mumbai
```

## Git Workflow

### Branches
- `main` - Production-ready code
- `develop` - Development branch
- `feat-*` - Feature branches
- `fix-*` - Bug fix branches

### Current Branch
- `feat-init-verichain-supply-phase1-smartcontracts` ✅

### Commit Guidelines
```
feat: Add new feature
fix: Fix a bug
docs: Documentation changes
test: Add tests
refactor: Code refactoring
style: Code style changes
chore: Build/config changes
```

## Build Artifacts

### Generated Directories (Git Ignored)
```
smart-contracts/
├── artifacts/           # Compiled contracts
├── cache/               # Hardhat cache
└── node_modules/        # Dependencies

backend/
└── node_modules/        # Dependencies

frontend/
├── build/               # Production build
└── node_modules/        # Dependencies
```

## Testing

### Smart Contracts
- **Location:** `smart-contracts/test/`
- **Framework:** Hardhat + Chai
- **Coverage:** 100% of functions
- **Tests:** 15 test cases
- **Run:** `npm test`

### Backend (Planned)
- **Framework:** Jest / Mocha
- **Types:** Unit, Integration, E2E
- **Run:** `npm test`

### Frontend (Planned)
- **Framework:** Jest + React Testing Library
- **Types:** Component, Integration
- **Run:** `npm test`

## Deployment

### Current
- ✅ Local Hardhat Network
- ✅ Polygon Mumbai Testnet

### Planned
- 🔄 Backend API (Railway/Heroku)
- 🔄 Frontend (Vercel/Netlify)
- 🔄 Polygon Mainnet (Production)

## Status Legend
- ✅ Complete
- 🔄 In Progress / Planned
- ⏸️ On Hold
- ❌ Not Started

## Contact & Support

For questions about the project structure:
1. Check the main `README.md`
2. Review documentation in `docs/`
3. Check contract docs in `smart-contracts/README.md`

---

**Last Updated:** January 22, 2025  
**Phase:** 1 (Smart Contracts) - Complete ✅
