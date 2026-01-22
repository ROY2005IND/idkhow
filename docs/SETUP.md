# VeriChain Supply - Setup Guide

Complete setup instructions for the VeriChain Supply blockchain platform.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: Latest version
- **MetaMask**: Browser extension (for testing)
- **Code Editor**: VS Code (recommended)

## 🚀 Phase 1: Smart Contracts Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd verichain-supply
```

### Step 2: Install Smart Contract Dependencies

```bash
cd smart-contracts
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `smart-contracts` directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your configuration:

```env
POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_without_0x_prefix
```

**⚠️ Important:** Never commit your `.env` file. It's already in `.gitignore`.

### Step 4: Get Testnet Tokens

1. Visit [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
2. Connect your MetaMask wallet
3. Select "Mumbai" network
4. Request test MATIC tokens
5. Wait for tokens to arrive (usually 1-2 minutes)

### Step 5: Compile Smart Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 3 Solidity files successfully
```

### Step 6: Run Tests

```bash
npm test
```

All tests should pass. You should see:
```
✓ AccessControl tests passing
✓ ProductRegistry tests passing
✓ SupplyChainEvents tests passing
```

### Step 7: Deploy to Local Network (Optional)

Start a local Hardhat node:
```bash
npm run node
```

In a new terminal, deploy:
```bash
npm run deploy:local
```

### Step 8: Deploy to Polygon Mumbai Testnet

```bash
npm run deploy:mumbai
```

**Save the contract addresses** that are displayed after deployment!

Example output:
```
AccessControl deployed to: 0x1234...
ProductRegistry deployed to: 0x5678...
SupplyChainEvents deployed to: 0x9abc...
```

### Step 9: Update Environment Variables

Add the deployed contract addresses to your `.env` file:

```env
ACCESS_CONTROL_ADDRESS=0x1234...
PRODUCT_REGISTRY_ADDRESS=0x5678...
SUPPLY_CHAIN_EVENTS_ADDRESS=0x9abc...
```

## ✅ Verification

Verify your smart contracts are deployed correctly:

1. Visit [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
2. Search for your contract addresses
3. Verify transactions were successful

## 🔧 Common Issues & Solutions

### Issue: "Insufficient funds for gas"
**Solution:** Request more test MATIC from the faucet

### Issue: "Nonce too high"
**Solution:** Reset your MetaMask account:
1. MetaMask → Settings → Advanced → Reset Account

### Issue: "Network connection timeout"
**Solution:** Try alternative RPC URLs:
```env
POLYGON_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
```

### Issue: "Module not found"
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📱 MetaMask Configuration

### Add Mumbai Testnet to MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter the following details:

```
Network Name: Mumbai Testnet
RPC URL: https://rpc-mumbai.maticvigil.com
Chain ID: 80001
Currency Symbol: MATIC
Block Explorer: https://mumbai.polygonscan.com
```

### Import Your Account

1. MetaMask → Account Icon → Import Account
2. Paste your private key (from `.env`)
3. Account should now appear in MetaMask

## 🧪 Testing the Deployment

### Interact with Contracts via Hardhat Console

```bash
npx hardhat console --network polygonMumbai
```

In the console:
```javascript
const AccessControl = await ethers.getContractFactory("AccessControl");
const accessControl = await AccessControl.attach("YOUR_CONTRACT_ADDRESS");

// Check owner
const owner = await accessControl.owner();
console.log("Owner:", owner);

// Get your role
const role = await accessControl.getRole("YOUR_WALLET_ADDRESS");
console.log("Your role:", role);
```

## 📚 Next Steps

✅ **Phase 1 Complete!** Your smart contracts are deployed.

**Phase 2 (Coming Next):**
1. Backend API development
2. Frontend React application
3. Integration testing
4. User interface design

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Mumbai Faucet](https://faucet.polygon.technology/)
- [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Guide](https://metamask.io/faqs/)

## 💡 Development Tips

1. **Keep your private key secure**: Never share or commit it
2. **Use Mumbai testnet**: Free testing before mainnet
3. **Test thoroughly**: Run all tests before deploying
4. **Gas optimization**: Enable optimizer in Hardhat config
5. **Version control**: Commit after each successful deployment

## 🆘 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search [Hardhat issues](https://github.com/NomicFoundation/hardhat/issues)
3. Review [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
4. Check contract events on PolygonScan

## 📝 Development Workflow

```bash
# 1. Make changes to contracts
# 2. Compile
npm run compile

# 3. Run tests
npm test

# 4. Deploy to local network for testing
npm run node
npm run deploy:local

# 5. Deploy to testnet
npm run deploy:mumbai

# 6. Verify on PolygonScan
# Visit: https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
```

## 🎓 Learning Resources

- [CryptoZombies](https://cryptozombies.io/) - Learn Solidity
- [Ethereum.org](https://ethereum.org/developers) - Developer docs
- [OpenZeppelin](https://docs.openzeppelin.com/) - Secure contracts
- [Hardhat Tutorial](https://hardhat.org/tutorial) - Complete guide

---

**Congratulations!** 🎉 You've successfully set up VeriChain Supply's smart contracts.
