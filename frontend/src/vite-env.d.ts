/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_WEB3_PROVIDER_URL: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_CHAIN_NAME: string
  readonly VITE_ACCESS_CONTROL_ADDRESS: string
  readonly VITE_PRODUCT_REGISTRY_ADDRESS: string
  readonly VITE_SUPPLY_CHAIN_EVENTS_ADDRESS: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_QR_SCANNER: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_MAPS: string
  readonly VITE_MAX_RETRIES: string
  readonly VITE_RETRY_DELAY: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
