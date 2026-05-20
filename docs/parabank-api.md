# ParaBank REST API Documentation

Base URL: `https://parabank.parasoft.com/parabank/services/bank`

## Response Format

By default, all endpoints return **XML**. To receive **JSON**, include the header:

```
Accept: application/json
```

---

## Authentication

### Login

```
GET /login/{username}/{password}
```

Authenticates a user and returns their customer profile.

**Path Parameters**

| Parameter  | Type   | Description       |
|------------|--------|-------------------|
| username   | string | Account username  |
| password   | string | Account password  |

**Response**

```json
{
  "id": 12212,
  "firstName": "John",
  "lastName": "Smith",
  "address": {
    "street": "1431 Main Street",
    "city": "Anytown",
    "state": "OH",
    "zipCode": "45055"
  },
  "phoneNumber": "515-858-3184",
  "ssn": "674-56-0498"
}
```

---

## Customers

### Get Customer

```
GET /customers/{id}
```

Returns the profile of a specific customer.

**Path Parameters**

| Parameter | Type    | Description  |
|-----------|---------|--------------|
| id        | integer | Customer ID  |

**Response** — same shape as the Login response above.

---

### Get Customer Accounts

```
GET /customers/{id}/accounts
```

Returns all accounts belonging to a customer.

**Path Parameters**

| Parameter | Type    | Description  |
|-----------|---------|--------------|
| id        | integer | Customer ID  |

**Response**

```json
{
  "account": [
    {
      "id": 13344,
      "customerId": 12212,
      "type": "CHECKING",
      "balance": 2315.45
    },
    {
      "id": 13455,
      "customerId": 12212,
      "type": "SAVINGS",
      "balance": 1050.00
    }
  ]
}
```

Account `type` values: `CHECKING`, `SAVINGS`, `LOAN`.

---

### Get Customer Transactions

```
GET /customers/{id}/transactions
```

Returns all transactions across all accounts for a customer.

**Path Parameters**

| Parameter | Type    | Description  |
|-----------|---------|--------------|
| id        | integer | Customer ID  |

**Response** — array of transaction objects (see transaction shape under [Get Account Transactions](#get-account-transactions)).

---

## Accounts

### Get Account

```
GET /accounts/{id}
```

Returns details for a specific account.

**Path Parameters**

| Parameter | Type    | Description  |
|-----------|---------|--------------|
| id        | integer | Account ID   |

**Response**

```json
{
  "id": 13344,
  "customerId": 12212,
  "type": "CHECKING",
  "balance": 2315.45
}
```

---

### Get Account Transactions

```
GET /accounts/{id}/transactions
```

Returns all transactions for a specific account.

**Path Parameters**

| Parameter | Type    | Description  |
|-----------|---------|--------------|
| id        | integer | Account ID   |

**Response**

```json
{
  "transaction": [
    {
      "id": 8901,
      "accountId": 13344,
      "type": "Debit",
      "date": "2024-01-15",
      "amount": 150.00,
      "description": "Bill Payment"
    },
    {
      "id": 8902,
      "accountId": 13344,
      "type": "Credit",
      "date": "2024-01-16",
      "amount": 500.00,
      "description": "Funds Transfer Received"
    }
  ]
}
```

Transaction `type` values: `Debit`, `Credit`.

---

## Transactions

### Transfer Funds

```
POST /transfer
```

Transfers funds between two accounts.

**Query Parameters**

| Parameter   | Type    | Required | Description              |
|-------------|---------|----------|--------------------------|
| fromAccountId | integer | yes    | Source account ID        |
| toAccountId   | integer | yes    | Destination account ID   |
| amount        | number  | yes    | Amount to transfer       |

**Example**

```
POST /transfer?fromAccountId=13344&toAccountId=13455&amount=100.00
```

**Response** — `200 OK` with empty body on success.

---

### Request Loan

```
POST /requestLoan
```

Submits a loan application.

**Query Parameters**

| Parameter       | Type    | Required | Description                        |
|-----------------|---------|----------|------------------------------------|
| customerId      | integer | yes      | ID of the applicant                |
| amount          | number  | yes      | Requested loan amount              |
| downPayment     | number  | yes      | Down payment amount                |
| fromAccountId   | integer | yes      | Account to debit the down payment  |

**Example**

```
POST /requestLoan?customerId=12212&amount=1000&downPayment=100&fromAccountId=13344
```

**Response**

```json
{
  "responseDate": "2024-01-15",
  "loanProviderName": "ParaBank",
  "approved": true,
  "accountId": 15678
}
```

`approved` is `false` when the application is denied; `accountId` is omitted in that case.

---

### Pay Bill

```
POST /billpay
```

Pays a bill from a specified account.

**Query Parameters**

| Parameter | Type    | Required | Description              |
|-----------|---------|----------|--------------------------|
| accountId | integer | yes      | Account to debit         |
| amount    | number  | yes      | Payment amount           |

**Request Body** — `application/json` or `application/xml`

```json
{
  "name": "Utility Company",
  "address": {
    "street": "123 Power Ave",
    "city": "Anytown",
    "state": "OH",
    "zipCode": "45055"
  },
  "phoneNumber": "555-123-4567",
  "accountNumber": "9876543",
  "amount": 75.00
}
```

**Example**

```
POST /billpay?accountId=13344&amount=75.00
```

**Response**

```json
{
  "payeeName": "Utility Company",
  "amount": 75.00,
  "accountId": 13344
}
```

---

## Error Handling

Errors are returned as plain text or XML/JSON depending on the `Accept` header.

| HTTP Status | Meaning                                          |
|-------------|--------------------------------------------------|
| 400         | Bad request — missing or invalid parameters      |
| 404         | Resource not found (customer, account, etc.)     |
| 500         | Internal server error                            |

---

## Usage Notes for Playwright API Tests

- Set `Accept: application/json` on all requests to get JSON responses instead of XML.
- The login endpoint returns the `customerId` needed for subsequent customer/account calls.
- Account IDs returned from `GET /customers/{id}/accounts` are used for transfer, loan, and bill-pay endpoints.
- `POST` endpoints accept parameters as **query strings**, not request bodies (except bill pay, which requires a body for payee details).
- The test environment resets periodically; seed data uses username `john` / password `demo`.
