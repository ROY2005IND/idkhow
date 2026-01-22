# VeriChain Supply - Backend API (Phase 2)

🚀 **Status: COMPLETED** - Production-ready Node.js/Express backend API for VeriChain Supply platform.

## 📋 Overview

A professional, production-ready RESTful API server that bridges the frontend with the blockchain smart contracts from Phase 1. Built with enterprise-grade security, comprehensive error handling, and full Web3 integration.

## 🚀 Tech Stack

### Core
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL 14+ with connection pooling
- **Blockchain:** Web3.js 1.10.3
- **Authentication:** JWT (jsonwebtoken 9.0.2)

### Security & Utilities
- **Validation:** Express-validator 7.0.1 + Joi 17.9.2
- **Logging:** Winston 3.10.0
- **Security:** Helmet.js 7.0.0, CORS 2.8.5, Rate Limiter Flexible 2.4.2
- **Database:** pg (PostgreSQL client) 8.11.3, Knex 2.5.1
- **HTTP:** Morgan 1.10.0, Axios 1.5.0

### Development
- **Testing:** Jest 29.6.4, Supertest 6.3.3
- **Linting:** ESLint 8.47.0 with Standard config
- **Dev Server:** Nodemon 3.0.1

## ✨ Implemented Features

### 🔐 Authentication & Security
- ✅ MetaMask wallet authentication with message signing
- ✅ JWT token generation and verification
- ✅ Role-based access control (RBAC) - Admin, Manufacturer, Distributor, Retailer, Customer
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling

### 🔗 Smart Contract Integration
- ✅ Web3.js integration with Polygon Mumbai testnet
- ✅ ProductRegistry contract interaction
- ✅ SupplyChainEvents contract interaction
- ✅ AccessControl contract verification
- ✅ Transaction hash tracking
- ✅ Gas price optimization

### 📦 Product Management
- ✅ Register products on blockchain + PostgreSQL
- ✅ List products with pagination and filtering
- ✅ Get product details (with manufacturer info)
- ✅ Update product metadata
- ✅ Archive products
- ✅ Product search by category, manufacturer, status

### 🚚 Supply Chain Event Tracking
- ✅ Log supply chain events (Manufacturing → Customer)
- ✅ GPS location tracking (latitude/longitude)
- ✅ Event timeline visualization
- ✅ Supply chain statistics
- ✅ Recent activity tracking

### ✅ Verification System
- ✅ Product authenticity verification
- ✅ Verification history logging
- ✅ IP address and user agent tracking
- ✅ Anti-counterfeiting checks

### 📊 Dashboard & Analytics
- ✅ Dashboard statistics (products, events, verifications)
- ✅ Recent products and events
- ✅ Analytics by status, category, manufacturer
- ✅ Trending and activity reports

### 🛡️ Data Synchronization
- ✅ Sync blockchain events with PostgreSQL
- ✅ Transaction status tracking
- ✅ Error recovery mechanism
- ✅ Data validation and integrity checks

## 📂 Complete Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── blockchain.js        # Web3.js configuration
│   │   └── env.js              # Environment validation
│   ├── controllers/             # API Route Controllers
│   │   ├── authController.js    # Authentication endpoints
│   │   ├── productController.js # Product management
│   │   ├── eventController.js   # Event logging
│   │   ├── verificationController.js # Verification
│   │   ├── dashboardController.js    # Dashboard stats
│   │   └── analyticsController.js    # Analytics
│   ├── middleware/              # Express Middleware
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── validation.js       # Input validation
│   ├── models/                 # Data Models
│   │   ├── User.js            # User model
│   │   ├── Product.js         # Product model
│   │   └── Event.js           # Event model
│   ├── routes/                # API Routes
│   │   ├── auth.js            # Auth routes
│   │   ├── products.js        # Product routes
│   │   ├── events.js          # Event routes
│   │   └── verify.js          # Verification routes
│   ├── services/              # Business Logic
│   │   ├── blockchainService.js   # Blockchain interactions
│   │   ├── productService.js      # Product operations
│   │   ├── eventService.js        # Event operations
│   │   └── walletService.js       # Wallet authentication
│   ├── utils/                 # Utilities
│   │   ├── logger.js          # Winston logger
│   │   ├── validators.js      # Input validators
│   │   └── constants.js       # App constants
│   └── index.js              # Main entry point
├── contracts/                # Smart Contract ABIs
│   ├── ProductRegistry.json
│   ├── SupplyChainEvents.json
│   └── AccessControl.json
├── migrations/              # Database migrations
├── tests/                   # Test suites
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 Full API Endpoints

### 🔐 Authentication
- `POST /api/auth/connect-wallet` - Connect MetaMask wallet
- `POST /api/auth/verify-signature` - Verify wallet signature
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user profile

### 📦 Products (Protected)
- `POST /api/products/register` - Register new product (Manufacturer only)
- `GET /api/products` - List all products (paginated)
- `GET /api/products/:productId` - Get product details
- `PUT /api/products/:productId` - Update product info
- `GET /api/products/:productId/history` - Full product history

### 🚚 Supply Chain Events (Protected)
- `POST /api/events` - Add supply chain event (Role-based)
- `GET /api/products/:productId/events` - Get events for product
- `GET /api/events/timeline/:productId` - Timeline view
- `GET /api/events/stats` - Supply chain statistics

### ✅ Verification
- `POST /api/verify/product` - Verify product authenticity
- `GET /api/verify/:productId` - Get verification status
- `GET /api/verify/history/:productId` - Verification history

### 📊 Dashboard & Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-products` - Recently registered products
- `GET /api/dashboard/recent-events` - Recent supply chain events
- `GET /api/analytics/products-by-status` - Products by status
- `GET /api/analytics/products-by-category` - Products by category
- `GET /api/analytics/events-by-type` - Events by type
- `GET /api/analytics/verification-trends` - Verification trends
- `GET /api/analytics/top-manufacturers` - Top manufacturers

### 🏥 Health
- `GET /api/health` - API health check

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- MetaMask wallet (for testing)
- Polygon Mumbai testnet tokens

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/verichain_supply

# Blockchain
WEB3_PROVIDER_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY_FOR_TRANSACTIONS=your_private_key

# Smart Contract Addresses (from Phase 1)
PRODUCT_REGISTRY_ADDRESS=0x...
SUPPLY_CHAIN_EVENTS_ADDRESS=0x...
ACCESS_CONTROL_ADDRESS=0x...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

```bash
# Create database
createdb verichain_supply

# Run migrations
npm run migrate

# Run seeds (if available)
npm run seed
```

### 4. Start Development Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

API will be available at: **http://localhost:5000/api/health**

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Database Schema

### Users Table
- `id` (PK, SERIAL)
- `wallet_address` (VARCHAR 42, UNIQUE)
- `email` (VARCHAR 255)
- `username` (VARCHAR 100)
- `role` (ENUM: Admin, Manufacturer, Distributor, Retailer, Customer)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Products Table
- `id` (PK, SERIAL)
- `product_id` (INTEGER, UNIQUE) - Blockchain productId
- `blockchain_id` (VARCHAR 255)
- `name` (VARCHAR 255)
- `manufacturer_address` (VARCHAR 42, FK → users)
- `batch_number` (VARCHAR 100)
- `description` (TEXT)
- `category` (VARCHAR 100)
- `price` (DECIMAL 10,2)
- `currency` (VARCHAR 10)
- `created_at` (TIMESTAMP)
- `blockchain_tx_hash` (VARCHAR 255)
- `status` (ENUM: Active, Archived)

### Events Table
- `id` (PK, SERIAL)
- `event_id` (INTEGER)
- `product_id` (INTEGER, FK → products)
- `event_type` (VARCHAR 50)
- `location` (VARCHAR 255)
- `latitude` (DECIMAL 10,8)
- `longitude` (DECIMAL 10,8)
- `timestamp` (BIGINT)
- `actor_address` (VARCHAR 42, FK → users)
- `notes` (TEXT)
- `blockchain_tx_hash` (VARCHAR 255)
- `created_at` (TIMESTAMP)

### Verification Logs Table
- `id` (PK, SERIAL)
- `product_id` (INTEGER, FK → products)
- `verifier_address` (VARCHAR 42, FK → users)
- `verification_status` (VARCHAR 50)
- `verified_at` (TIMESTAMP)
- `ip_address` (VARCHAR 50)
- `user_agent` (TEXT)

## 🔐 Authentication Flow

```
User (Browser)
    ↓
1. Click "Connect Wallet" → POST /auth/connect-wallet
    ↓
2. Backend generates message → Returns message to sign
    ↓
3. MetaMask signs message (user action)
    ↓
4. POST /auth/verify-signature with signed message
    ↓
5. Backend verifies signature using Web3.js
    ↓
6. Create/fetch user from DB
    ↓
7. Generate JWT token → Return { token, user }
    ↓
8. Frontend stores token in localStorage
    ↓
9. All future requests: Authorization: Bearer {JWT}
```

## 📈 Performance Features

- **Connection Pooling:** PostgreSQL connection pooling for optimal performance
- **Rate Limiting:** Prevents API abuse (100 req/15min per IP)
- **Caching Ready:** Structured for Redis integration
- **Pagination:** All list endpoints support pagination
- **Async Processing:** Non-blocking I/O operations
- **Query Optimization:** Indexed database queries

## 🔒 Security Best Practices

- ✅ All inputs validated and sanitized
- ✅ SQL injection prevention using parameterized queries
- ✅ Authentication required for protected routes
- ✅ Role-based authorization system
- ✅ CORS properly configured
- ✅ Security headers with Helmet.js
- ✅ JWT with expiration and issuer verification
- ✅ Rate limiting on all endpoints
- ✅ Error messages don't leak sensitive data
- ✅ Private keys never exposed in responses

## 🔗 Integration with Phase 1

The backend integrates seamlessly with the smart contracts deployed in Phase 1:

```javascript
// Blockchain interaction example
const blockchainResult = await blockchainService.registerProductOnChain({
  name: productData.name,
  batchNumber: productData.batchNumber,
  description: productData.description,
  category: productData.category
})

// Returns: { productId, txHash, blockNumber }
```

## 🎯 Success Criteria - ALL MET ✅

- ✅ Server starts without errors on port 5000
- ✅ PostgreSQL connected successfully
- ✅ All API endpoints return correct responses
- ✅ Blockchain service connects to Polygon Mumbai
- ✅ Smart contracts can be called from backend
- ✅ JWT authentication working
- ✅ All tests passing
- ✅ API documentation complete
- ✅ Database migrations created
- ✅ Security best practices implemented
- ✅ Error handling comprehensive
- ✅ Logging and monitoring configured
- ✅ Ready for Phase 3 (Frontend integration)

## 🚦 Next: Phase 3

This backend is ready for Phase 3: **React Frontend Integration**

Next steps:
- Connect React frontend to these API endpoints
- Implement MetaMask wallet connection
- Build professional UI with animations
- Create blockchain visualization
- Deploy to production with CI/CD

## 📞 Support

For questions or issues:
- Check API health: `GET /api/health`
- Review logs: `./logs/app.log`
- Test contracts: `cd smart-contracts && npm test`

## 📄 License

MIT License - VeriChain Supply Team

---

**🏆 Phase 2: COMPLETE - Backend API Production Ready** ✨
