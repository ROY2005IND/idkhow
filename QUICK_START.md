# VeriChain Supply - Quick Start Guide

Get started with VeriChain Supply in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet
- Basic knowledge of blockchain

## 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd verichain-supply

# Install smart contract dependencies
cd smart-contracts
npm install
```

## 2. Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your private key
nano .env
```

Add:
```env
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here_without_0x
```

**Get Test MATIC:**
Visit https://faucet.polygon.technology/ for free Mumbai testnet tokens

## 3. Compile & Test (1 minute)

```bash
# Compile smart contracts
npm run compile

# Run tests
npm test
```

Expected: ✅ 15 tests passing

## 4. Deploy (1 minute)

```bash
# Deploy to Mumbai testnet
npm run deploy:mumbai
```

Save the contract addresses displayed!

## 5. Verify Deployment

Visit https://mumbai.polygonscan.com/ and search for your contract addresses.

---

## Quick Commands

### Development
```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Start local node
npm run node

# Clean build
npm run clean
```

### Deployment
```bash
# Deploy locally
npm run deploy:local

# Deploy to Mumbai testnet
npm run deploy:mumbai
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/VeriChainSupply.test.js

# Run tests with gas report
REPORT_GAS=true npm test
```

---

## Quick Contract Interaction

### Using Hardhat Console

```bash
# Start console (Mumbai testnet)
npx hardhat console --network polygonMumbai

# In console:
const AccessControl = await ethers.getContractFactory("AccessControl");
const accessControl = await AccessControl.attach("YOUR_CONTRACT_ADDRESS");

// Assign manufacturer role
await accessControl.assignRole("0xYourAddress", 2);

// Check role
const role = await accessControl.getRole("0xYourAddress");
console.log(role.toString()); // Should be 2
```

### Using Scripts

Create `scripts/interact.js`:
```javascript
const hre = require("hardhat");

async function main() {
  const accessControl = await hre.ethers.getContractAt(
    "AccessControl",
    "YOUR_CONTRACT_ADDRESS"
  );
  
  const [owner] = await hre.ethers.getSigners();
  console.log("Owner:", owner.address);
  
  const role = await accessControl.getRole(owner.address);
  console.log("Role:", role.toString());
}

main().catch(console.error);
```

Run:
```bash
npx hardhat run scripts/interact.js --network polygonMumbai
```

---

## Project Structure (Quick Reference)

```
verichain-supply/
├── smart-contracts/      ← You are here (Phase 1)
│   ├── contracts/       ← Solidity contracts
│   ├── scripts/         ← Deployment scripts
│   ├── test/            ← Test files
│   └── hardhat.config.js
├── backend/             ← Coming in Phase 2
├── frontend/            ← Coming in Phase 2
└── docs/                ← Documentation
```

---

## Common Tasks

### Add a New Contract
1. Create `contracts/MyContract.sol`
2. Write Solidity code
3. Run `npm run compile`
4. Create test in `test/MyContract.test.js`
5. Update `scripts/deploy.js`

### Test a Contract
```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npx hardhat test --watch

# Test specific contract
npx hardhat test --grep "AccessControl"
```

### Deploy to Local Network
```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

---

## Roles Quick Reference

| Role ID | Name | Permissions |
|---------|------|-------------|
| 0 | None | No permissions |
| 1 | Admin | Full access |
| 2 | Manufacturer | Register products |
| 3 | Distributor | Add events |
| 4 | Retailer | Add events |
| 5 | Customer | Read-only |

---

## Event Types Quick Reference

| Type ID | Name | When to Use |
|---------|------|-------------|
| 0 | Manufacturing | Product created |
| 1 | Warehouse | Stored in warehouse |
| 2 | Shipping | In transit |
| 3 | Retail | At retail store |
| 4 | Customer | Delivered |

---

## Troubleshooting

### "Insufficient funds for gas"
**Solution:** Get test MATIC from https://faucet.polygon.technology/

### "Network connection failed"
**Solution:** Check your RPC URL in `.env`

### "Nonce too high"
**Solution:** Reset MetaMask account (Settings → Advanced → Reset Account)

### "Module not found"
**Solution:** Run `npm install` again

---

## Next Steps

1. ✅ Complete this Quick Start
2. 📖 Read [full README](README.md)
3. 🏗️ Review [Architecture](docs/ARCHITECTURE.md)
4. 📝 Check [Contract Usage](docs/SMART_CONTRACT_USAGE.md)
5. 🚀 Start Phase 2 development

---

## Useful Links

- 📚 [Main README](README.md)
- 🏛️ [Architecture Docs](docs/ARCHITECTURE.md)
- 🔧 [Setup Guide](docs/SETUP.md)
- 💡 [Contract Usage](docs/SMART_CONTRACT_USAGE.md)
- 🧪 [Hardhat Docs](https://hardhat.org/)
- 🔗 [Polygon Docs](https://docs.polygon.technology/)

---

## Get Help

- Check documentation in `docs/`
- Review test files for examples
- Search Hardhat issues: https://github.com/NomicFoundation/hardhat/issues
- Ethereum Stack Exchange: https://ethereum.stackexchange.com/

---

**Happy Coding! 🚀**

Made with ❤️ by VeriChain Supply Team
