# Testing Guide

This guide covers testing strategies and procedures for BuildBills.

## Overview

BuildBills uses multiple testing approaches:
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between services
- **End-to-End Tests**: Test complete user workflows
- **Manual Testing**: Test on real devices

## Firebase Functions Testing

### Setup

Firebase Functions use Jest and firebase-functions-test for testing.

```bash
cd packages/firebase-functions
npm test
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- invoices.test.ts

# Run in watch mode
npm test -- --watch
```

### Writing Tests

Example test structure:

```typescript
import * as test from 'firebase-functions-test';

const testEnv = test();

describe('MyFunction', () => {
  let myFunction: any;

  beforeAll(() => {
    const functions = require('../functions/myFunction');
    myFunction = functions.myFunction;
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it('should do something', async () => {
    const data = { input: 'test' };
    const context = { auth: { uid: 'test-user' } };
    
    const wrapped = testEnv.wrap(myFunction);
    const result = await wrapped(data, context);
    
    expect(result.success).toBe(true);
  });
});
```

### Test Coverage

Aim for at least 80% code coverage:

```bash
npm test -- --coverage
```

Coverage reports are generated in `packages/firebase-functions/coverage/`.

## Mobile App Testing

### Setup

React Native uses Jest and React Native Testing Library.

```bash
cd apps/mobile
npm test
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- LoginScreen.test.tsx

# Update snapshots
npm test -- -u
```

### Writing Component Tests

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByText('BuildBills')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('handles login button press', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      // Verify expected behavior
    });
  });
});
```

### Snapshot Testing

```typescript
import React from 'react';
import renderer from 'react-test-renderer';
import DashboardScreen from '../DashboardScreen';

it('renders correctly', () => {
  const tree = renderer.create(<DashboardScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## Integration Testing

### Firebase Emulator Testing

Test with local Firebase emulators:

```bash
# Start emulators
npm run firebase:emulator

# In another terminal, run integration tests
npm run test:integration
```

### API Integration Tests

```typescript
import { BuildBillsApiClient } from '@buildbills/api-client';

describe('API Integration', () => {
  let client: BuildBillsApiClient;

  beforeAll(() => {
    client = new BuildBillsApiClient('http://localhost:5001/test-project/us-central1');
    client.setAuthToken('test-token');
  });

  it('should create and retrieve invoice', async () => {
    // Create invoice
    const createResult = await client.createInvoice({
      clientName: 'Test Client',
      amount: 100,
      description: 'Test',
    });

    expect(createResult.success).toBe(true);
    const invoiceId = createResult.data?.invoiceId;

    // Retrieve invoice
    const getResult = await client.getInvoice(invoiceId!);
    expect(getResult.data?.clientName).toBe('Test Client');
  });
});
```

## End-to-End Testing

### Detox (for React Native)

Install Detox for E2E testing:

```bash
cd apps/mobile
npm install --save-dev detox
```

Example E2E test:

```typescript
describe('Invoice Creation Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should create a new invoice', async () => {
    // Login
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Navigate to invoices
    await element(by.id('invoices-tab')).tap();
    await element(by.id('create-invoice-button')).tap();

    // Fill form
    await element(by.id('client-name-input')).typeText('Test Client');
    await element(by.id('amount-input')).typeText('100');
    
    // Submit
    await element(by.id('submit-button')).tap();

    // Verify
    await expect(element(by.text('Invoice created successfully'))).toBeVisible();
  });
});
```

## Manual Testing Checklist

### Authentication
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] User receives error with invalid credentials
- [ ] Password reset works correctly
- [ ] Google Sign-In works (if implemented)

### Invoices
- [ ] User can create invoice
- [ ] User can view invoice list
- [ ] User can edit invoice
- [ ] User can delete invoice
- [ ] Invoice number auto-generates correctly

### Expenses
- [ ] User can create expense
- [ ] User can view expense list
- [ ] User can edit expense
- [ ] User can delete expense
- [ ] Receipt upload works

### Camera/Image Features
- [ ] Camera opens successfully
- [ ] Photos can be captured
- [ ] Photos can be selected from gallery
- [ ] Vision AI extracts data correctly
- [ ] Extracted data populates form fields

### Email Integration
- [ ] Gmail connection works
- [ ] Outlook connection works
- [ ] Email sync retrieves messages
- [ ] Attachments are extracted

### UI/UX
- [ ] App loads without crashes
- [ ] Navigation works smoothly
- [ ] Forms validate input correctly
- [ ] Error messages display appropriately
- [ ] Loading states show correctly

### Platform-Specific
- [ ] iOS app runs correctly
- [ ] Android app runs correctly
- [ ] Permissions requested properly
- [ ] Push notifications work (if implemented)

## Performance Testing

### Load Testing

Test Firebase Functions under load:

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run load-test.yml
```

Example `load-test.yml`:
```yaml
config:
  target: 'https://us-central1-project.cloudfunctions.net'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Create Invoice"
    flow:
      - post:
          url: "/createInvoice"
          headers:
            Authorization: "Bearer ${token}"
          json:
            clientName: "Test"
            amount: 100
```

### Mobile Performance

Use React Native Profiler:

```typescript
import Profiler from 'react-native/Libraries/Performance/Profiler';

<Profiler id="MyScreen" onRender={callback}>
  <MyScreen />
</Profiler>
```

## Continuous Integration

### GitHub Actions

Example workflow for running tests:

```yaml
name: Test
on: [push, pull_request]

jobs:
  test-functions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: cd packages/firebase-functions && npm ci
      - run: cd packages/firebase-functions && npm test

  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd apps/mobile && npm ci
      - run: cd apps/mobile && npm test
```

## Best Practices

1. **Write tests before fixing bugs** - Reproduce bug in test first
2. **Keep tests simple** - One assertion per test when possible
3. **Mock external dependencies** - Don't call real APIs in unit tests
4. **Use descriptive test names** - Should explain what is being tested
5. **Test edge cases** - Not just happy paths
6. **Maintain test data** - Use fixtures and factories
7. **Run tests frequently** - Before every commit
8. **Review test coverage** - Aim for 80%+ coverage
9. **Keep tests fast** - Unit tests should run in seconds
10. **Document complex tests** - Add comments explaining why

## Troubleshooting

### Tests Failing After Dependency Update
```bash
# Clear all caches
npm cache clean --force
cd apps/mobile && rm -rf node_modules && npm install
cd packages/firebase-functions && rm -rf node_modules && npm install
```

### Firebase Emulator Issues
```bash
# Kill processes on ports
lsof -ti:8080,5001,9099 | xargs kill -9

# Clear emulator data
rm -rf ~/.config/firebase/emulators
```

### React Native Test Issues
```bash
# Clear Jest cache
cd apps/mobile
npx jest --clearCache
```
