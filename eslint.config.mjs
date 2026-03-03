import { dirname } from 'path'
import { fileURLToPath } from 'url'
import nextConfig from 'eslint-config-next'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = [
  ...nextConfig,
  ...coreWebVitals,
  ...typescript,
  {
    settings: {
      next: {
        rootDir: __dirname,
      },
    },
  },
]

export default config
