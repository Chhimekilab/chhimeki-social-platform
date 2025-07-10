# Development Setup Guide

## Chhimeki Social Platform - Development Environment

This guide will help you set up and manage the development and testing environments for the Chhimeki Social Platform.

## Prerequisites

- Node.js (v16, v18, or v20)
- npm or yarn
- Docker and Docker Compose (optional)
- Git

## Environment Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The project uses different environment configurations:

- **Development**: `.env.development`
- **Test**: `.env.test`
- **Production**: `.env.production`

### 3. Available Scripts

#### Development
```bash
# Start development server
npm run start:dev

# Start with specific environment
npm run start:test
```

#### Testing
```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (single run)
npm run test:ci
```

#### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

#### Building
```bash
# Build for development
npm run build:dev

# Build for testing
npm run build:test

# Build for production
npm run build:prod
```

## Docker Development

### Development Environment
```bash
# Start development environment with Docker
docker-compose -f docker-compose.dev.yml up

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# Stop environment
docker-compose -f docker-compose.dev.yml down
```

### Test Environment
```bash
# Run tests in Docker
docker-compose -f docker-compose.test.yml up

# Run specific test service
docker-compose -f docker-compose.test.yml run web-test npm run test:coverage
```

## Mock API Server

A mock API server is included for development:

```bash
# Start mock API server
cd mock-api
npm install
npm start

# Or with Docker Compose (automatically starts with dev environment)
docker-compose -f docker-compose.dev.yml up
```

API endpoints:
- `GET /api/health` - Health check
- `GET /api/users` - Get users
- `GET /api/posts` - Get posts

## Testing Strategy

### Test Structure
- Unit tests: `src/**/*.test.js`
- Integration tests: `src/**/__tests__/**/*.js`
- Test setup: `src/setupTests.js`

### Coverage Requirements
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

### Running Tests
```bash
# Watch mode (development)
npm run test:watch

# Single run with coverage
npm run test:coverage

# CI mode
npm run test:ci
```

## Code Quality Standards

### ESLint Configuration
- React best practices
- Hooks rules
- Accessibility standards
- No unused variables (warnings)
- No console.log in production (errors)

### Prettier Configuration
- Single quotes
- 2-space indentation
- 80 character line width
- Trailing commas (ES5)

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Development integration branch
- Feature branches: `feature/feature-name`
- Hotfix branches: `hotfix/issue-description`

### Commit Standards
Use conventional commit messages:
```
feat: add new user authentication
fix: resolve login validation issue
docs: update API documentation
test: add user service tests
refactor: improve error handling
```

## CI/CD Pipeline

GitHub Actions automatically:
1. Runs tests on multiple Node.js versions
2. Checks code formatting and linting
3. Generates coverage reports
4. Builds production artifacts

## Environment Variables

### Development
- `REACT_APP_ENV=development`
- `REACT_APP_API_URL=http://localhost:3001/api`
- `REACT_APP_DEBUG=true`

### Test
- `REACT_APP_ENV=test`
- `REACT_APP_API_URL=http://localhost:3001/api/test`
- `REACT_APP_DEBUG=false`

### Production
- `REACT_APP_ENV=production`
- `REACT_APP_API_URL=https://api.chhimeki-social.com`
- `REACT_APP_DEBUG=false`

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose files or environment variables
2. **Docker permission issues**: Ensure Docker daemon is running and user has permissions
3. **Node version issues**: Use Node.js v16, v18, or v20
4. **Cache issues**: Clear npm cache with `npm cache clean --force`

### Getting Help

1. Check this documentation
2. Review error logs in terminal
3. Check GitHub Actions for CI/CD issues
4. Verify environment variable configuration

## Next Steps

1. Install dependencies: `npm install`
2. Start development server: `npm run start:dev`
3. Run tests: `npm run test:watch`
4. Start coding!

For more information, check the main README.md file.