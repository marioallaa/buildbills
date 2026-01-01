# API Documentation

## Overview

The BuildBills API is built on Firebase Cloud Functions and provides RESTful endpoints for managing invoices, expenses, and integrations.

**Base URL:** `https://us-central1-buildbills-project.cloudfunctions.net`

**Authentication:** Bearer token (Firebase ID token) in Authorization header

## Authentication

All API requests require a valid Firebase ID token.

```javascript
// Get ID token from Firebase Auth
const idToken = await firebase.auth().currentUser.getIdToken();

// Include in requests
headers: {
  'Authorization': `Bearer ${idToken}`,
  'Content-Type': 'application/json'
}
```

## Endpoints

### Health Check

**GET** `/healthCheck`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "BuildBills Functions"
}
```

---

## Invoice Management

### Create Invoice

**POST** `/createInvoice`

Create a new invoice.

**Request Body:**
```json
{
  "clientName": "Acme Corp",
  "clientEmail": "contact@acme.com",
  "amount": 1500.00,
  "description": "Web development services",
  "items": [
    {
      "description": "Frontend development",
      "quantity": 40,
      "unitPrice": 25.00,
      "total": 1000.00
    },
    {
      "description": "Backend development",
      "quantity": 20,
      "unitPrice": 25.00,
      "total": 500.00
    }
  ],
  "dueDate": "2024-02-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "invoiceId": "abc123xyz"
}
```

### Get Invoice

**POST** `/getInvoice`

Retrieve a specific invoice.

**Request Body:**
```json
{
  "invoiceId": "abc123xyz"
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "userId": "user123",
  "clientName": "Acme Corp",
  "clientEmail": "contact@acme.com",
  "amount": 1500.00,
  "description": "Web development services",
  "items": [...],
  "dueDate": "2024-02-01T00:00:00.000Z",
  "status": "draft",
  "invoiceNumber": "INV-2024-0001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Invoice

**POST** `/updateInvoice`

Update an existing invoice.

**Request Body:**
```json
{
  "invoiceId": "abc123xyz",
  "status": "sent",
  "amount": 1600.00
}
```

**Response:**
```json
{
  "success": true
}
```

### Delete Invoice

**POST** `/deleteInvoice`

Delete an invoice.

**Request Body:**
```json
{
  "invoiceId": "abc123xyz"
}
```

**Response:**
```json
{
  "success": true
}
```

### List Invoices

**POST** `/listInvoices`

List all invoices for the authenticated user.

**Request Body:**
```json
{
  "limit": 50,
  "startAfter": "lastDocId"
}
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "abc123xyz",
      "clientName": "Acme Corp",
      "amount": 1500.00,
      "status": "draft",
      "invoiceNumber": "INV-2024-0001",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## Expense Management

### Create Expense

**POST** `/createExpense`

Create a new expense.

**Request Body:**
```json
{
  "category": "Materials",
  "amount": 250.00,
  "description": "Construction materials for project X",
  "date": "2024-01-15T00:00:00.000Z",
  "receiptUrl": "https://storage.googleapis.com/.../receipt.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "expenseId": "exp123xyz"
}
```

### Get Expense

**POST** `/getExpense`

Retrieve a specific expense.

**Request Body:**
```json
{
  "expenseId": "exp123xyz"
}
```

### Update Expense

**POST** `/updateExpense`

Update an existing expense.

**Request Body:**
```json
{
  "expenseId": "exp123xyz",
  "amount": 275.00,
  "category": "Equipment"
}
```

### Delete Expense

**POST** `/deleteExpense`

Delete an expense.

**Request Body:**
```json
{
  "expenseId": "exp123xyz"
}
```

### List Expenses

**POST** `/listExpenses`

List all expenses for the authenticated user.

**Request Body:**
```json
{
  "limit": 50,
  "startAfter": "lastDocId"
}
```

---

## Vision AI

### Analyze Invoice

**POST** `/analyzeInvoice`

Analyze an invoice image and extract data using Google Cloud Vision AI.

**Request Body:**
```json
{
  "imageUrl": "https://storage.googleapis.com/.../invoice.jpg"
}
```

Or with base64:
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "extractedData": {
    "clientName": "Acme Corp",
    "amount": 1500.00,
    "invoiceNumber": "INV-2024-0001",
    "date": "01/15/2024",
    "items": []
  },
  "fullText": "INVOICE\nINV-2024-0001\n..."
}
```

### Analyze Receipt

**POST** `/analyzeReceipt`

Analyze a receipt image and extract data.

**Request Body:**
```json
{
  "imageUrl": "https://storage.googleapis.com/.../receipt.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "extractedData": {
    "merchant": "Home Depot",
    "amount": 250.00,
    "date": "01/15/2024",
    "category": "Materials",
    "items": []
  },
  "fullText": "HOME DEPOT\n..."
}
```

---

## Email Integration

### Connect Gmail

**POST** `/connectGmail`

Connect a Gmail account for invoice/receipt retrieval.

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfH6SMB...",
  "refreshToken": "1//0gIu8yBc..."
}
```

**Response:**
```json
{
  "success": true,
  "provider": "gmail"
}
```

### Connect Outlook

**POST** `/connectOutlook`

Connect an Outlook account.

**Request Body:**
```json
{
  "accessToken": "EwAoA8l6BAA...",
  "refreshToken": "M.R3_BAY..."
}
```

**Response:**
```json
{
  "success": true,
  "provider": "outlook"
}
```

### Sync Emails

**POST** `/syncEmails`

Sync emails and extract invoices/receipts.

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "emailsScanned": 150,
  "documentsExtracted": 12
}
```

### Extract Invoices from Email

**POST** `/extractInvoicesFromEmail`

Extract invoices from a specific email.

**Request Body:**
```json
{
  "emailId": "email123"
}
```

**Response:**
```json
{
  "success": true,
  "attachments": [
    {
      "name": "invoice.pdf",
      "type": "application/pdf"
    }
  ]
}
```

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": {
    "code": "unauthenticated",
    "message": "User must be authenticated"
  }
}
```

### Common Error Codes

- `unauthenticated` - Missing or invalid authentication
- `permission-denied` - User doesn't have access to resource
- `not-found` - Resource not found
- `invalid-argument` - Invalid request parameters
- `internal` - Internal server error

---

## Rate Limits

- 1000 requests per minute per user
- 10000 requests per hour per user

Exceeding rate limits will return a `429 Too Many Requests` error.

---

## Using the API Client

The `@buildbills/api-client` package provides a convenient wrapper:

```typescript
import { BuildBillsApiClient } from '@buildbills/api-client';

const client = new BuildBillsApiClient();
client.setAuthToken(idToken);

// Create invoice
const result = await client.createInvoice({
  clientName: 'Acme Corp',
  amount: 1500.00,
  description: 'Web development services'
});

// List invoices
const invoices = await client.listInvoices();

// Analyze receipt
const analysis = await client.analyzeReceipt(imageUrl);
```
