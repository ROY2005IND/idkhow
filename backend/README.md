# VeriChain Supply - Backend API

Node.js/Express backend API for VeriChain Supply platform.

## 📋 Overview

RESTful API server that bridges the frontend with the blockchain smart contracts.

## 🚀 Tech Stack (Planned)

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Blockchain:** Web3.js / Ethers.js
- **Database:** MongoDB / PostgreSQL
- **Authentication:** JWT
- **Validation:** Joi / Express Validator
- **Documentation:** Swagger / OpenAPI

## 🏗️ Planned Features

- RESTful API endpoints for contract interaction
- User authentication and authorization
- Off-chain data caching
- QR code generation
- Email notifications
- Analytics and reporting
- Rate limiting and security
- API documentation

## 📂 Planned Structure

```
backend/
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── config/          # Configuration files
│   └── app.js           # Express app setup
├── tests/               # API tests
├── .env.example         # Environment variables template
└── package.json
```

## 🔌 Planned API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Register new product (Manufacturer only)
- `GET /api/products/manufacturer/:address` - Get products by manufacturer

### Supply Chain Events
- `GET /api/events/product/:id` - Get product event history
- `POST /api/events` - Add new supply chain event
- `GET /api/events/:id` - Get specific event details

### Users & Roles
- `GET /api/users/:address/role` - Get user role
- `POST /api/admin/assign-role` - Assign role to user (Admin only)

### Verification
- `GET /api/verify/:productId` - Verify product authenticity
- `GET /api/qr/:productId` - Generate QR code for product

## 📝 Status

**Phase 2: To be implemented**

This directory is a placeholder for Phase 2 development. Smart contracts must be deployed first.

## 🔗 Dependencies

This backend will interact with:
- Deployed smart contracts (Phase 1)
- Database for off-chain storage
- Polygon Mumbai testnet / Mainnet

## 🔐 Security Features (Planned)

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- CORS configuration
- Helmet.js security headers
- Environment variable protection
