const jwt = require('jsonwebtoken')
const Web3 = require('web3')
const logger = require('../utils/logger')
const User = require('../models/User')

class WalletService {
  constructor () {
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpire = process.env.JWT_EXPIRE
  }

  generateSignMessage (walletAddress) {
    const nonce = Math.floor(Math.random() * 1000000)
    const timestamp = Math.floor(Date.now() / 1000)

    const message = `Welcome to VeriChain Supply!\\n\\n` +
                    `Sign this message to verify your wallet address.\\n\\n` +
                    `Wallet: ${walletAddress}\\n` +
                    `Nonce: ${nonce}\\n` +
                    `Timestamp: ${timestamp}\\n\\n` +
                    `This signature request will not trigger any blockchain transaction or cost any gas fees.`

    return {
      message,
      nonce,
      timestamp
    }
  }

  async verifySignature (walletAddress, signature, originalMessage) {
    try {
      logger.info('Verifying wallet signature:', { walletAddress })

      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(originalMessage, signature)

      // Check if the recovered address matches the provided wallet address (case-insensitive)
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        logger.warn('Signature verification failed: addresses do not match', {
          recovered: recoveredAddress,
          provided: walletAddress
        })
        return false
      }

      logger.info('Signature verified successfully:', { walletAddress })
      return true
    } catch (error) {
      logger.error('Signature verification error:', error.message)
      return false
    }
  }

  async getOrCreateUserFromWallet (walletAddress, userData = {}) {
    try {
      // Check if user already exists
      let user = await User.getUserByWalletAddress(walletAddress)

      if (!user) {
        logger.info('Creating new user for wallet:', { walletAddress })

        // Create new user
        const userId = await User.createUser({
          walletAddress,
          email: userData.email || null,
          username: userData.username || null,
          role: userData.role || 'Customer'
        })

        user = await User.getUserByWalletAddress(walletAddress)
      } else {
        logger.info('User found for wallet:', { walletAddress, userId: user.id })
      }

      return user
    } catch (error) {
      logger.error('Failed to get or create user from wallet:', error.message)
      throw error
    }
  }

  createJWTToken (user) {
    try {
      const payload = {
        userId: user.id,
        walletAddress: user.wallet_address,
        role: user.role,
        email: user.email,
        username: user.username
      }

      const options = {
        expiresIn: this.jwtExpire,
        issuer: 'verichain-supply',
        audience: 'verichain-users'
      }

      const token = jwt.sign(payload, this.jwtSecret, options)

      logger.info('JWT token created for user:', { userId: user.id })

      return token
    } catch (error) {
      logger.error('Failed to create JWT token:', error.message)
      throw error
    }
  }

  verifyJWTToken (token) {
    try {
      const options = {
        issuer: 'verichain-supply',
        audience: 'verichain-users'
      }

      const decoded = jwt.verify(token, this.jwtSecret, options)

      logger.info('JWT token verified successfully:', { userId: decoded.userId })

      return decoded
    } catch (error) {
      logger.error('JWT token verification failed:', error.message)
      throw error
    }
  }

  async authenticateWithWallet (walletAddress, signature) {
    try {
      // Generate sign message for verification
      const { message } = this.generateSignMessage(walletAddress)

      // Verify the signature
      const isValid = await this.verifySignature(walletAddress, signature, message)

      if (!isValid) {
        throw new Error('Invalid signature')
      }

      // Get or create user
      const user = await this.getOrCreateUserFromWallet(walletAddress)

      // Check user role on blockchain (if needed)
      // const roleCheck = await blockchainService.verifyUserRoleOnChain(walletAddress, user.role)

      // Create JWT token
      const accessToken = this.createJWTToken(user)

      logger.info('Wallet authentication successful:', { userId: user.id })

      return {
        user,
        accessToken,
        refreshToken: null // Optional: implement refresh token mechanism
      }
    } catch (error) {
      logger.error('Wallet authentication failed:', error.message)
      throw error
    }
  }

  async refreshToken (refreshToken) {
    try {
      // Verify refresh token (if implemented)
      // For now, just create a new access token
      // In production, implement proper refresh token mechanism with token storage
      throw new Error('Refresh token not implemented')
    } catch (error) {
      logger.error('Token refresh failed:', error.message)
      throw error
    }
  }

  logout () {
    // For JWT, logout is handled client-side by removing the token
    // In production, you might want to implement token blacklist
    logger.info('User logged out')
    return true
  }

  async getUserFromToken (token) {
    try {
      if (!token) {
        throw new Error('No token provided')
      }

      // Remove Bearer prefix if present
      const cleanToken = token.replace('Bearer ', '')

      // Verify and decode token
      const decoded = this.verifyJWTToken(cleanToken)

      // Get user from database
      const user = await User.getUserById(decoded.userId)

      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      logger.error('Failed to get user from token:', error.message)
      throw error
    }
  }
}

module.exports = new WalletService()
