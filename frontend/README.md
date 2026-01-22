# VeriChain Supply - Frontend

Professional animated React frontend for VeriChain Supply blockchain platform.

## 🚀 Tech Stack (100% FREE & OPEN SOURCE)

### Core Framework
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite 5** - Build tool
- **Zustand 4** - State management

### Styling & Animations
- **TailwindCSS 3** - Utility-first CSS
- **Framer Motion 11** - Production-ready animations
- **React Spring 9** - Physics-based animations

### Web3 Integration
- **Web3.js 1.10** - Blockchain interaction
- **Ethers.js 6** - Alternative Web3 library
- **MetaMask** - Wallet integration

### Forms & Validation
- **React Hook Form 7** - Form management
- **Zod 3** - Schema validation
- **@hookform/resolvers** - Form validation integration

### Data Visualization
- **Chart.js 4** - Charts
- **react-chartjs-2** - React wrapper

### Utilities
- **axios** - HTTP client
- **date-fns** - Date utilities
- **qrcode.react** - QR code generation
- **clsx & tailwind-merge** - Class name utilities

### Notifications
- **React Toastify 10** - Toast notifications

### Development & Testing
- **ESLint 8** - Linting
- **Prettier 3** - Code formatting
- **Vitest 1** - Unit testing
- **Playwright 1** - E2E testing
- **React Testing Library 14** - Component testing

## 📦 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
```

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Blockchain Configuration
VITE_WEB3_PROVIDER_URL=https://rpc-mumbai.maticvigil.com
VITE_CHAIN_ID=80001
VITE_CHAIN_NAME=Polygon Mumbai Testnet

# Smart Contract Addresses (Update after deployment)
VITE_ACCESS_CONTROL_ADDRESS=
VITE_PRODUCT_REGISTRY_ADDRESS=
VITE_SUPPLY_CHAIN_EVENTS_ADDRESS=

# Application Configuration
VITE_APP_NAME=VeriChain Supply
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false

# Feature Flags
VITE_ENABLE_QR_SCANNER=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MAPS=true

# Retry Configuration
VITE_MAX_RETRIES=3
VITE_RETRY_DELAY=1000
```

### Smart Contract Setup

1. Deploy contracts using Phase 1 scripts
2. Copy deployed addresses to `.env` file:
   ```bash
   VITE_ACCESS_CONTROL_ADDRESS=0x...
   VITE_PRODUCT_REGISTRY_ADDRESS=0x...
   VITE_SUPPLY_CHAIN_EVENTS_ADDRESS=0x...
   ```

## 🛠️ Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
# API requests are proxied to http://localhost:5000
```

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e    # Run Playwright E2E tests
npm type-check       # Type check only
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/              # Shared components (ErrorBoundary, Notifications, etc.)
│   ├── WalletConnect.tsx    # MetaMask connection component
│   ├── AnimatedCard.tsx     # Reusable animated card
│   └── Navbar.tsx          # Navigation bar
│
├── pages/                  # Page components
│   ├── Home.tsx           # Landing page
│   ├── Dashboard.tsx       # Main dashboard
│   ├── RegisterProduct.tsx  # Product registration form
│   ├── TrackProduct.tsx     # Product tracking
│   ├── VerifyProduct.tsx    # Product verification
│   ├── Wallet.tsx          # Wallet profile
│   ├── Analytics.tsx       # Charts & analytics
│   └── NotFound.tsx       # 404 page
│
├── services/
│   ├── web3Service.ts      # Smart contract interactions
│   ├── apiService.ts       # API calls with retry
│   ├── walletService.ts     # Wallet operations
│   ├── errorService.ts      # Centralized error handling
│   └── logService.ts       # DIY logging (sends to backend)
│
├── hooks/
│   ├── useWeb3.ts         # Web3 initialization
│   ├── useAuth.ts         # Authentication
│   ├── useWallet.ts       # Wallet operations
│   ├── useAsync.ts        # Safe async wrapper
│   ├── useErrorHandler.ts # Error handling
│   └── useLocalStorage.ts # Safe storage
│
├── utils/
│   ├── validators.ts       # Zod validation schemas
│   ├── security.ts        # Security utilities
│   ├── errorMessages.ts   # User-friendly messages
│   ├── errorCodes.ts      # Error type definitions
│   ├── retry.ts          # Retry logic
│   ├── logger.ts         # Logging utility
│   ├── constants.ts      # App constants
│   └── cn.ts            # Class name utility
│
├── types/
│   ├── error.types.ts     # Error type definitions
│   ├── api.types.ts      # API response types
│   ├── blockchain.types.ts # Blockchain types
│   └── product.types.ts   # Product types
│
├── config/
│   ├── contracts.ts       # Contract addresses & ABIs
│   ├── networks.ts        # Network configuration
│   ├── api.ts            # API endpoints
│   └── errorConfig.ts    # Error handling config
│
├── animations/
│   ├── blockchainAnimations.ts  # Blockchain effects
│   └── transitionAnimations.ts # Page transitions
│
├── store/
│   └── appStore.ts       # Zustand store
│
├── tests/
│   ├── setup.ts          # Test setup
│   ├── unit/            # Unit tests
│   └── e2e/             # E2E tests (Playwright)
│
└── styles/
    └── globals.css       # Tailwind + custom styles
```

## 🔐 Key Features

### 1. **MetaMask Integration**
- Connect/disconnect wallet
- Auto-network switching (Mumbai)
- Balance display
- Address copying
- Signature verification

### 2. **Smart Contract Interaction**
- Product registration
- Supply chain events
- Product history retrieval
- Gas estimation
- Transaction tracking

### 3. **Professional Animations**
- Page transitions
- Card hover effects
- Loading states
- Blockchain visualizations
- Smooth interactions (60 FPS)

### 4. **Comprehensive Error Handling**
- Global error boundary
- Centralized error service
- User-friendly messages
- Auto-retry logic
- Error logging to backend

### 5. **Input Validation**
- Zod schemas
- Real-time validation
- Format checking
- User guidance

### 6. **Responsive Design**
- Mobile-first approach
- Tailwind breakpoints
- Touch-friendly UI
- Adaptive layouts

## 📊 Pages

### Dashboard (`/dashboard`)
- Animated stat counters
- Recent products
- Recent events
- Quick action buttons
- Real-time updates

### Register Product (`/register-product`)
- Multi-step form
- Real-time validation
- Gas estimation
- Progress tracking
- Success feedback

### Track Product (`/track`)
- Product search
- Complete history
- Interactive timeline
- Event details
- Location display

### Verify Product (`/verify`)
- QR code generation
- Verification status
- Confidence score
- Blockchain confirmation

### Analytics (`/analytics`)
- Charts (Pie, Bar, Line)
- Product statistics
- Event distribution
- Time-based analysis

### Wallet (`/wallet`)
- Profile card
- Balance display
- Network info
- Transaction history
- Help resources

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Coverage Targets
- Unit Tests: 80%+
- Integration Tests: 75%+
- E2E Tests: Critical user flows

## 📱 Mobile Responsiveness

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Configure GitHub Pages to serve dist/ folder
```

## 🔒 Security

- Input sanitization (XSS prevention)
- HTTPS enforcement
- Secure token storage (sessionStorage)
- Contract address validation
- Rate limiting (via backend)
- Helmet headers (via backend)

## ⚡ Performance

- **Build Optimizations**:
  - Code splitting
  - Tree shaking
  - Lazy loading
  - Image optimization

- **Load Time**: < 3 seconds
- **Lighthouse Score**: 90+

## 🐛 Troubleshooting

### MetaMask Not Detected
- Install MetaMask: https://metamask.io/download/
- Refresh page after installation

### Wrong Network
- Click "Switch" button in wallet dropdown
- Or manually switch to Polygon Mumbai Testnet

### Contract Not Deployed
- Deploy contracts using: `npm run contracts:deploy:mumbai`
- Update addresses in `.env` file
- Restart dev server

### API Errors
- Check backend is running: `cd backend && npm start`
- Verify API_URL in `.env`
- Check browser console for details

## 📄 License

This project is open source and free to use for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please follow the code style:
- TypeScript strict mode
- Prettier formatting
- ESLint compliance
- Test coverage

## 💰 Cost Breakdown

| Component | Cost |
|-----------|-------|
| React 18 + TypeScript | $0 |
| TailwindCSS 3 | $0 |
| Framer Motion | $0 |
| Web3.js | $0 |
| Zustand | $0 |
| Vite | $0 |
| Vercel Hosting | $0 |
| **TOTAL** | **$0** |

All tools are 100% free and open source! 🎉
