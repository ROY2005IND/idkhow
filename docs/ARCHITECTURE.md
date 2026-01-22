# VeriChain Supply - System Architecture

## 🏛️ Overview

VeriChain Supply is a decentralized supply chain tracking and product authentication platform built on blockchain technology. The system provides immutable tracking of products from manufacturing to customer delivery, ensuring transparency and preventing counterfeiting.

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  - Product Registration UI                                  │
│  - Supply Chain Tracking Dashboard                          │
│  - QR Code Scanner & Generator                              │
│  - User Authentication                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ REST API / Web3
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              Backend API (Node.js/Express)                  │
│  - API Endpoints                                             │
│  - Authentication & Authorization                            │
│  - Off-chain Data Caching                                    │
│  - QR Code Generation                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│   Database    │    │  Blockchain Layer  │
│   (MongoDB)   │    │  (Polygon Mumbai)  │
│               │    │                    │
│ - User Data   │    │  Smart Contracts:  │
│ - Cache       │    │  - AccessControl   │
│ - Analytics   │    │  - ProductRegistry │
│               │    │  - SupplyChainEvents│
└───────────────┘    └────────────────────┘
```

## 🔗 Component Interactions

### 1. Smart Contract Layer
**Technology:** Solidity, Hardhat, Polygon Mumbai

**Components:**
- **AccessControl.sol**: Manages user roles (Admin, Manufacturer, Distributor, Retailer, Customer)
- **ProductRegistry.sol**: Registers and stores product information
- **SupplyChainEvents.sol**: Logs immutable supply chain events

**Interactions:**
- AccessControl provides role verification for ProductRegistry and SupplyChainEvents
- ProductRegistry validates product existence before events are logged
- All contracts emit events for off-chain tracking

### 2. Backend API Layer
**Technology:** Node.js, Express, Web3.js, MongoDB

**Responsibilities:**
- Expose RESTful endpoints for frontend
- Interact with smart contracts via Web3.js
- Cache blockchain data for faster retrieval
- Handle user authentication (JWT)
- Generate QR codes for products
- Send notifications

**Key Services:**
- ContractService: Web3 contract interaction
- AuthService: User authentication & JWT
- CacheService: Database caching
- QRService: QR code generation

### 3. Frontend Layer
**Technology:** React, Web3.js, Material-UI

**Features:**
- Responsive web application
- MetaMask integration for blockchain transactions
- Role-based UI components
- Real-time product tracking
- QR code scanning and verification
- Product history visualization

## 🔄 Data Flow

### Product Registration Flow
```
1. Manufacturer logs into system
2. Frontend validates user role (Manufacturer)
3. Manufacturer fills product registration form
4. Backend API receives request
5. Backend calls ProductRegistry.registerProduct()
6. Smart contract validates caller role via AccessControl
7. Product created on blockchain with unique ID
8. Event emitted and logged
9. Backend caches product data in database
10. Frontend displays success and product ID
```

### Supply Chain Event Logging Flow
```
1. Authorized user (Distributor/Retailer) logs event
2. Frontend sends event data to backend
3. Backend validates user permissions
4. Backend calls SupplyChainEvents.addEvent()
5. Smart contract verifies:
   - User has required role
   - Product exists in registry
6. Event stored on blockchain with timestamp
7. Event emitted for tracking
8. Backend updates cache
9. Product history updated in real-time
```

### Product Verification Flow
```
1. Customer scans QR code
2. Frontend extracts product ID
3. Backend API calls ProductRegistry.getProduct()
4. Backend calls SupplyChainEvents.getProductHistory()
5. Smart contracts return immutable data
6. Frontend displays:
   - Product details
   - Full supply chain history
   - Authenticity verification
```

## 🔐 Security Architecture

### Access Control Layers

**1. Smart Contract Level**
- Role-based permissions (Owner, Admin, Manufacturer, Distributor, Retailer)
- Modifier-based access control
- Only authorized addresses can perform actions

**2. Backend API Level**
- JWT authentication
- Role verification before contract calls
- Rate limiting to prevent abuse
- Input validation and sanitization

**3. Frontend Level**
- MetaMask wallet connection
- Role-based UI rendering
- Client-side validation

### Data Integrity
- Blockchain provides immutable storage
- Cryptographic signatures for all transactions
- Event logging for audit trails
- Timestamp verification

## 📊 Database Schema (Planned)

### Users Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String,
  email: String,
  role: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Products Cache
```javascript
{
  _id: ObjectId,
  productId: Number,
  name: String,
  manufacturer: String,
  batchNumber: String,
  category: String,
  blockchainTxHash: String,
  createdAt: Date
}
```

### Events Cache
```javascript
{
  _id: ObjectId,
  eventId: Number,
  productId: Number,
  eventType: String,
  location: String,
  actor: String,
  timestamp: Date,
  blockchainTxHash: String
}
```

## 🌐 Deployment Architecture

### Development Environment
- Local Hardhat node for blockchain testing
- MongoDB local instance
- React development server

### Testnet Environment
- Polygon Mumbai testnet
- MongoDB Atlas
- Backend deployed on Heroku/Railway
- Frontend deployed on Vercel/Netlify

### Production Environment (Future)
- Polygon Mainnet
- Scalable MongoDB cluster
- Load-balanced backend servers
- CDN for frontend

## 🔄 Scalability Considerations

1. **Off-chain Caching**: Store frequently accessed data in MongoDB
2. **Event Indexing**: Index blockchain events for quick retrieval
3. **IPFS Integration**: Store large files (images, documents) on IPFS
4. **Layer 2 Solution**: Use Polygon for lower gas fees
5. **Microservices**: Split backend into smaller services as needed

## 🛠️ Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Blockchain | Solidity 0.8.20, Hardhat |
| Network | Polygon Mumbai (Testnet) |
| Backend | Node.js, Express.js, Web3.js |
| Database | MongoDB |
| Frontend | React 18, Material-UI |
| Authentication | JWT, MetaMask |
| Testing | Hardhat Test, Jest, React Testing Library |
| Deployment | Vercel (Frontend), Railway (Backend) |

## 📈 Future Enhancements

1. **IoT Integration**: Automatic event logging from IoT sensors
2. **AI Analytics**: Predictive analytics for supply chain optimization
3. **Multi-chain**: Support for Ethereum, BSC, etc.
4. **Mobile App**: React Native mobile application
5. **NFT Integration**: Products as NFTs for luxury goods
6. **Oracle Integration**: Real-world data integration (temperature, location)

## 🤝 Integration Points

- **MetaMask**: Wallet connection and transaction signing
- **IPFS**: Decentralized file storage
- **The Graph**: Blockchain data indexing (future)
- **Chainlink**: Oracle services (future)
- **Email Services**: SendGrid/Mailgun for notifications
- **QR Code Libraries**: qrcode.js for generation and scanning
