#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`
🌐 Chhimeki Cross-Platform Setup
================================

Setting up the complete cross-platform development environment...
`);

// Helper function to run commands
function runCommand(command, options = {}) {
  console.log(`\n📦 Running: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: options.cwd || process.cwd() 
    });
    console.log('✅ Success');
  } catch (error) {
    console.error(`❌ Error running: ${command}`);
    console.error(error.message);
    if (!options.optional) {
      process.exit(1);
    }
  }
}

// Helper function to create directories
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Helper function to create files
function createFile(filePath, content) {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`📄 Created file: ${filePath}`);
}

// 1. Install root dependencies
console.log('\n1️⃣ Installing root dependencies...');
runCommand('yarn install');

// 2. Create missing TypeScript configurations
console.log('\n2️⃣ Setting up TypeScript configurations...');

// Root tsconfig.json
const rootTsConfig = {
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@chhimeki/shared": ["./packages/shared/src"],
      "@chhimeki/design-system": ["./packages/design-system/src"]
    }
  },
  "include": ["packages/*/src"],
  "exclude": ["node_modules", "dist", "build"]
};

createFile('tsconfig.json', JSON.stringify(rootTsConfig, null, 2));

// Web tsconfig.json
const webTsConfig = {
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES5",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "../shared/src", "../design-system/src"],
  "exclude": ["node_modules", "build"]
};

createFile('packages/web/tsconfig.json', JSON.stringify(webTsConfig, null, 2));

// 3. Create Tailwind configuration for web
console.log('\n3️⃣ Setting up Tailwind CSS...');

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../design-system/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`;

createFile('packages/web/tailwind.config.js', tailwindConfig);

// 4. Create PostCSS configuration
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

createFile('packages/web/postcss.config.js', postcssConfig);

// 5. Create shared service index
console.log('\n4️⃣ Setting up shared services...');

const sharedIndex = `// Shared services and utilities
export * from './services/locationService';
export * from './services/professionalService';
export * from './services/marketplaceService';
export * from './services/safetyService';

// Types
export * from './types';

// Utilities
export * from './utils';

// Constants
export * from './constants';`;

createFile('packages/shared/src/index.ts', sharedIndex);

// 6. Create types file
const typesFile = `export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Neighborhood {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  safetyRating: number;
  memberCount: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedAt: Date;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  seller: User;
  location: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  createdAt: Date;
}`;

createFile('packages/shared/src/types/index.ts', typesFile);

// 7. Create utilities
const utilsFile = `export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};`;

createFile('packages/shared/src/utils/index.ts', utilsFile);

// 8. Create constants
const constantsFile = `export const APP_CONFIG = {
  name: 'Chhimeki',
  version: '1.0.0',
  description: 'The ultimate super-app for community connections',
  website: 'https://chhimeki.com',
  supportEmail: 'support@chhimeki.com',
};

export const API_ENDPOINTS = {
  base: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  auth: '/auth',
  users: '/users',
  posts: '/posts',
  neighborhoods: '/neighborhoods',
  jobs: '/jobs',
  marketplace: '/marketplace',
  safety: '/safety',
};

export const STORAGE_KEYS = {
  user: 'chhimeki-user',
  token: 'chhimeki-token',
  theme: 'chhimeki-theme',
  location: 'chhimeki-location',
};

export const FEATURE_FLAGS = {
  enableProfessionalFeatures: true,
  enableMarketplace: true,
  enableSafetyFeatures: true,
  enableRealTimeChat: true,
  enableVideoChat: false,
  enableAR: false,
};`;

createFile('packages/shared/src/constants/index.ts', constantsFile);

// 9. Create Rollup config for shared package
const rollupConfig = `import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
};`;

createFile('packages/shared/rollup.config.js', rollupConfig);
createFile('packages/design-system/rollup.config.js', rollupConfig);

// 10. Create Metro config for mobile
const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable monorepo support
config.watchFolders = [
  path.resolve(__dirname, '../../'),
];

config.resolver.nodeModulesPath = [
  path.resolve(__dirname, './node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Add support for shared packages
config.resolver.alias = {
  '@chhimeki/shared': path.resolve(__dirname, '../shared/src'),
  '@chhimeki/design-system': path.resolve(__dirname, '../design-system/src'),
};

module.exports = config;`;

createFile('packages/mobile/metro.config.js', metroConfig);

// 11. Create development environment files
console.log('\n5️⃣ Creating environment files...');

const webEnv = `REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=Chhimeki
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=false`;

createFile('packages/web/.env.development', webEnv);

const apiEnv = `# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/chhimeki

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis (optional)
REDIS_URL=redis://localhost:6379

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password`;

createFile('packages/api/.env.development', apiEnv);

// 12. Create README files
console.log('\n6️⃣ Creating documentation...');

const mainReadme = `# 🌐 Chhimeki Cross-Platform Super-App

A comprehensive social networking platform built with modern cross-platform architecture.

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/chhimeki-super-app.git
cd chhimeki-super-app

# Install dependencies
yarn install

# Setup database
yarn workspace @chhimeki/api setup

# Start development
yarn dev:all
\`\`\`

## 📱 Platforms

- **Web**: React + Tailwind CSS
- **Mobile**: React Native + Expo  
- **API**: Node.js + Express + PostgreSQL

## 📚 Documentation

- [Cross-Platform Architecture](./CROSS_PLATFORM_ARCHITECTURE.md)
- [API Documentation](./packages/api/README.md)
- [Design System](./packages/design-system/README.md)

## 🛠️ Development

\`\`\`bash
# Web development
yarn web

# Mobile development  
yarn mobile

# API development
yarn api
\`\`\`

## 🏗️ Building

\`\`\`bash
# Build web app
yarn build:web

# Build mobile app
yarn build:mobile
\`\`\`

## 📦 Deployment

See [deployment documentation](./docs/deployment.md) for platform-specific deployment guides.
`;

createFile('README.md', mainReadme);

// 13. Build shared packages
console.log('\n7️⃣ Building shared packages...');
runCommand('yarn workspace @chhimeki/shared build', { optional: true });
runCommand('yarn workspace @chhimeki/design-system build', { optional: true });

// 14. Final setup message
console.log(`
✅ Cross-Platform Setup Complete!

🎯 Next Steps:
1. Configure your database connection in packages/api/.env.development
2. Start development: yarn dev:all
3. Open web app: http://localhost:3000
4. Start mobile development: cd packages/mobile && yarn start

📚 Documentation:
- Architecture: ./CROSS_PLATFORM_ARCHITECTURE.md
- Web: ./packages/web/README.md  
- Mobile: ./packages/mobile/README.md
- API: ./packages/api/README.md

🚀 Happy coding with Chhimeki!
`);

console.log('\n🌟 Setup completed successfully!');