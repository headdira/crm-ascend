---
title: Disputes
source: https://tiendanube.github.io/api-documentation/resources/disputes
version: 2025-03
---

# Disputes

The Dispute API is designed to collect chargeback data from our Payments partners whenever a financial dispute is initiated. With this API, partners can create up to three disputes for a specific store, order, and transaction, including details such as the reason, evidence, and dispute amount. Additionally, the API supports updating the status and evidence of a dispute and retrieving details for a single dispute.

## Dispute States

A dispute can have six states: `needs_response`, `documentation_sent`, `insured`, `under_review`, `won`, and `lost`. When a dispute is created, it always starts in the `needs_response` state and can then transition to the other states according to the following logic:

### Valid Transitions

- **needs_response -> documentation_sent -> under_review -> won/lost**: Merchant sends documentation, dispute is reviewed, resolution is determined.

- **needs_response -> under_review -> won/lost**: Direct review without documentation_sent step.

- **needs_response -> insured -> won/lost**: Payment provider applies chargeback insurance.

- **needs_response -> won**: Merchant wins directly.

- **needs_response -> lost**: Time limit expired or dispute rejected without review.

- **under_review -> insured -> won/lost**: Insurance applied during review (max 1 transition to/from insured).

- **insured -> under_review -> won/lost**: Dispute returns from insured state for further review (max 1 transition).

> The `insured` state indicates that the payment provider applied chargeback insurance and covered part or all of the disputed amount.

## Reporting Retained Amounts

The `retained_total` field represents the amount currently withheld from the merchant due to the dispute. This field **must be included in every API call** (both POST and PUT), as it tracks the retention status throughout the dispute lifecycle.

### Key Rules

- `retained_total` must be sent with every transition (POST and PUT).

- The value must be between `0.00` and `amount.value` (the disputed amount).

- If there's no change in retention between states, send the same `retained_total` value.

- `0.00` means no retention (all funds released to merchant).

- Equal to `amount.value` means full retention.

### Common Scenarios

The following examples assume a dispute with `amount = 100.00 USD`.

#### 1. Merchant wins directly (no retention)

```
POST /disputes → retained_total: 0.00 (no retention at creation)PUT /disputes → status: "won", retained_total: 0.00 (still no retention)
```

#### 2. Merchant loses directly (full retention)

```
POST /disputes → retained_total: 0.00 (no retention at creation)PUT /disputes → status: "lost", retained_total: 100.00 (full amount retained)
```

#### 3. Under review, then loses (retains during review)

```
POST /disputes → retained_total: 0.00 (no retention at creation)PUT /disputes → status: "under_review", retained_total: 100.00 (retains full amount)PUT /disputes → status: "lost", retained_total: 100.00 (retention maintained)
```

#### 4. Under review, then wins (releases retention)

```
POST /disputes → retained_total: 0.00 (no retention at creation)PUT /disputes → status: "under_review", retained_total: 100.00 (retains full amount)PUT /disputes → status: "won", retained_total: 0.00 (releases all funds)
```

#### 5. Covered by insurance (releases retention)

```
POST /disputes → retained_total: 0.00 (no retention at creation)PUT /disputes → status: "under_review", retained_total: 100.00 (retains full amount)PUT /disputes → status: "insured", retained_total: 0.00 (insurance covers, releases funds)PUT /disputes → status: "lost", retained_total: 0.00 (remains released due to insurance)
```

> **Note:** The `retained_total` value reflects the current state of funds retention. When transitioning to `insured`, the payment provider typically releases the retained funds as they assume the liability for the dispute.

## API Endpoints

The Dispute API consists of three endpoints, defined in Nuvemshop's public API as follows:

- **`POST /disputes`**: Creates a dispute associated with an order and a transaction.

- **`PUT /disputes`**: Updates the details of an existing dispute.

- **`GET /disputes`**: Retrieves information about a dispute related to an order.

The token provided in the headers of the Dispute API endpoints is used to validate that the partner's application has the necessary scope to perform actions on the API. The required scope for these actions is `write_payments`. Additionally, the `app_id` associated with the token is used to filter disputes created by that application, ensuring that only disputes linked to the corresponding `app_id` can be accessed or modified. This mechanism ensures that partners can only interact with disputes for which they have specific permissions.

## POST /disputes

This endpoint will create a new Dispute in the `needs_response` state.

- **URL**: `POST https://api.tiendanube.com/2025-03/:store_id/orders/:order_id/transactions/:transaction_id/disputes`

- **Payload**: [See Payload](#post-payload)

- **Headers**: `{"Authentication": "Bearer "}`

- **Response**:

**Status**: 201

- **Body**: `{"id": ""}`

### POST Payload

| **Field** | **Type** | **Required** | **Description** 
| **reason_code** | One of: [ReasonCode](#reason-codes) | True | Code that identifies the reason why the dispute was created. 
| **external_reason_code** | String | True | Code that identifies the reason for the dispute according to the card operator. 
| **amount** | [Money](#money) | True | Amount of the dispute. 
| **retained_total** | [Money](#money) | True | Total amount retained for the dispute. 
| **retained_settled_amount** | [RetainedSettledAmount](#retainedsettledamount) | False | Converted retained amount from foreign currency to store currency, with exchange rate. Only applies if the merchant received the payment in a currency different than what the customer paid. 
| **fees** | Array | False | List of fees associated with the dispute (e.g., processing fees). 
| **evidence_url** | String | False | HTTPS URL to access dispute details on the payment provider. 
| **evidence_sent_at** | Date (ISO 8601 format) | False | Date when the evidence for the dispute was sent. 
| **initiated_at** | Date (ISO 8601 format) | True | Date when the dispute was registered. 
| **evidence_due_at** | Date (ISO 8601 format) | False | Deadline to submit evidence for the dispute. 

### Reason Codes

| **Value** | **Type** | **Description** 
| bank_cannot_process | String | The bank was unable to process the transaction, possibly due to a system error or malfunction. 
| check_returned | String | A check related to the transaction was returned unpaid by the bank. 
| credit_not_processed | String | The credit or refund promised to the cardholder was not processed or received. 
| customer_initiated | String | The cardholder initiated the dispute, often due to dissatisfaction or unrecognized transaction. 
| debit_not_authorized | String | The debit transaction was not authorized by the cardholder. 
| duplicate_transaction | String | The transaction is a duplicate of another transaction that has already been processed. 
| fraudulent_activity | String | The transaction is suspected to be fraudulent or unauthorized by the cardholder. 
| incorrect_account_details | String | The transaction was processed with incorrect account details, such as an incorrect account number. 
| insufficient_funds | String | The cardholder's account had insufficient funds to cover the transaction amount. 
| product_not_received | String | The cardholder claims they did not receive the product or service purchased. 
| product_unacceptable | String | The cardholder received the product or service but found it to be defective, damaged, or not as described. 
| subscription_canceled | String | The cardholder was charged for a subscription or recurring service after they had canceled it. 
| unrecognized | String | The cardholder does not recognize the transaction on their statement and believes it may be unauthorized. 

### Money

| Field | Type | Description 
| `value` | String | Amount of money as a string. E.g. `"49.99"`. 
| `currency` | String | ISO 4217 code for the currency, such as ARS, BRL, USD, etc. 

> ***Note:*** Decimal numbers are represented as string format for better decimal precision handling. It must contain two decimal places and use a point as decimal separator.

### RetainedSettledAmount

| Field | Type | Description 
| `value` | String | Converted amount in store currency. E.g. `"10000.00"`. 
| `currency` | String | ISO 4217 code for the store currency. 
| `exchange_rate` | Object | Exchange rate details with `value` (rate) and `from` (source currency). 

### Fee

| Field | Type | Description 
| `type` | String | Type of fee. Currently only `processing_fee` is supported. 
| `amount` | [Money](#money) | Amount of the fee. 

> **Note:** The retained amount (`retained_total`) should not include chargeback fees. Use the `fees` field for processing fees.

### Examples

Request Example

E.g.

#### Endpoint

`POST https://api.tiendanube.com/2025-03/1020559/orders/1612216732/transactions/02aaa5c6-080a-40e9-a61f-90ca2150d6a2/disputes`

#### Headers

```
{ "Authentication": "Bearer 12b2617c3362d9805cdf89079c4c99f928504eda", "Content-Type": "application/json"}
```

#### Payload

```
{ "reason_code": "fraudulent_activity", "external_reason_code": "fraud", "amount": { "value": "100.00", "currency": "USD" }, "retained_total": { "value": "100.00", "currency": "USD" }, "retained_settled_amount": { "value": "1000.00", "currency": "ARS", "exchange_rate": { "value": "10.00", "from": "USD" } }, "fees": [ { "type": "processing_fee", "amount": { "value": "5.00", "currency": "USD" } } ], "initiated_at": "2024-12-02T12:30:15.123Z", "evidence_url": "https://url.com", "evidence_sent_at": "2024-12-05T12:30:15.123Z", "evidence_due_at": "2024-12-10T12:30:15.123Z"}
```

Response Example

E.g.

```
{ "id": "67654a1d7f0000f100f03533"}
```

## PUT /disputes

This endpoint will update an existing Dispute, allowing it to transition to other states. It is important to note that attributes related to evidence can be updated or specified for the first time (if they were not provided during creation). Additionally, in the case of reaching any terminal state, the end date must be specified.

- **URL**: `PUT https://api.tiendanube.com/2025-03/:store_id/orders/:order_id/transactions/:transaction_id/disputes/:dispute_id`

- **Payload**: [See Payload](#put-payload)

- **Headers**: `{"Authentication": "Bearer "}`

- **Response**:

**Status**: 204

### PUT Payload

| **Field** | **Type** | **Required** | **Description** 
| **status** | String. One of: `needs_response`, `documentation_sent`, `insured`, `under_review`, `won`, `lost` | True | Status of the dispute. 
| **evidence_url** | String | False. Ignored if `status == won` or `status == lost` | HTTPS URL to access dispute details on the payment provider. 
| **evidence_sent_at** | Date (ISO 8601 format) | False. Ignored if `status == won` or `status == lost` | Date when the evidence for the dispute was sent. 
| **closed_at** | Date (ISO 8601 format) | Required if `status == won` or `status == lost`, ignored otherwise | Date when the dispute was closed. 
| **retained_total** | [Money](#money) | True | Total amount retained for the dispute. 
| **retained_settled_amount** | [RetainedSettledAmount](#retainedsettledamount) | False | Converted retained amount from foreign currency to store currency, with exchange rate. Only applies if the merchant received the payment in a currency different than what the customer paid. 

### Examples

Request Example

E.g.

#### Endpoint

`PUT https://api.tiendanube.com/2025-03/1020559/orders/1612216732/transactions/02aaa5c6-080a-40e9-a61f-90ca2150d6a2/disputes/67654a1d7f0000f100f03533`

#### Headers

```
{ "Authentication": "Bearer 12b2617c3362d9805cdf89079c4c99f928504eda", "Content-Type": "application/json"}
```

#### Payload

```
{ "status": "won", "evidence_url": "https://url.com", "evidence_sent_at": "2024-12-05T12:30:15.123Z", "closed_at": "2024-12-20T10:42:45.086Z", "retained_total": { "value": "100.00", "currency": "USD" }, "retained_settled_amount": { "value": "1000.00", "currency": "ARS", "exchange_rate": { "value": "10.00", "from": "USD" } }}
```

## GET /disputes

- **URL**: `GET https://api.tiendanube.com/2025-03/:store_id/orders/:order_id/transactions/:transaction_id/disputes/:dispute_id`

- **Headers**: `{"Authentication": "Bearer "}`

- **Response**:

**Status**: 200

- **Body**: [See Response](#get-response)

### GET Response

| **Field** | **Type** | **Description** 
| **id** | String | ID of the dispute. 
| **store_id** | String | ID of the store. 
| **app_id** | String | ID of the application that created the dispute. 
| **order_id** | String | ID of the order. 
| **transaction_id** | String | ID of the transaction related to the dispute. 
| **reason_code** | One of: [ReasonCode](#reason-codes) | Code that identifies the reason why the dispute was created. 
| **external_reason_code** | String | Code that identifies the reason for the dispute according to the card operator. 
| **amount** | [Money](#money) | Amount of the dispute. 
| **transaction_amount** | [Money](#money) | Original transaction amount. 
| **initiated_at** | Date ([ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601)) | Date when the dispute was registered. 
| **evidence_url** | String|Null | URL to access dispute details on the payment provider. 
| **evidence_sent_at** | Date ([ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601))|Null | Date when the evidence for the dispute was sent. 
| **closed_at** | Date ([ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601))|Null | Date when the dispute was closed. 
| **status** | String. One of: `needs_response`, `documentation_sent`, `insured`, `under_review`, `won`, `lost` | Current status of the dispute with its associated data. 
| **evidence_due_at** | Date ([ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601))|Null | Deadline to submit evidence for the dispute. 
| **retained_total** | [Money](#money) | Total amount currently retained for the dispute. 
| **retained_settled_amount** | [RetainedSettledAmount](#retainedsettledamount)|Null | Converted retained amount from foreign currency to store currency, with exchange rate. Only applies if the merchant received the payment in a currency different than what the customer paid. 
| **fees** | Array | List of fees associated with the dispute. 
| **history** | Array | List of previous states of the dispute. 

### StateHistory

| **Field** | **Type** | **Description** 
| **status** | String. One of: `needs_response`, `documentation_sent`, `insured`, `under_review`, `won`, `lost` | State to which the dispute transitioned. 
| **transitioned_at** | Date (ISO 8601 format) | Date when the dispute transitioned. 
| **retained_delta** | [Money](#money) | Change in retained amount for this transition. 
| **retained_total** | [Money](#money) | Total retained amount after this transition. 
| **retained_settled_amount** | [RetainedSettledAmount](#retainedsettledamount)|Null | Converted retained amount from foreign currency to store currency at time of transition. Only applies if the merchant received the payment in a currency different than what the customer paid. 

### Examples

Request Example

E.g.

#### Endpoint

`GET https://api.tiendanube.com/2025-03/1020559/orders/1612216732/transactions/02aaa5c6-080a-40e9-a61f-90ca2150d6a2/disputes/67654a1d7f0000f100f03533`

#### Headers

```
{ "Authentication": "Bearer 12b2617c3362d9805cdf89079c4c99f928504eda", "Accept": "application/json"}
```

Response Example

E.g.

```
{ "id": "67654a1d7f0000f100f03533", "store_id": "1020559", "app_id": "1234", "order_id": "1612216732", "transaction_id": "02aaa5c6-080a-40e9-a61f-90ca2150d6a2", "reason_code": "fraudulent_activity", "external_reason_code": "fraud", "amount": { "value": "100.00", "currency": "USD" }, "transaction_amount": { "value": "100.00", "currency": "USD" }, "initiated_at": "2024-12-02T12:30:15.123Z", "evidence_url": "https://url.com", "evidence_sent_at": "2024-12-05T12:30:15.123Z", "closed_at": "2024-12-25T10:42:45.086Z", "status": "won", "evidence_due_at": "2024-12-10T12:30:15.123Z", "retained_total": { "value": "100.00", "currency": "USD" }, "retained_settled_amount": { "value": "1000.00", "currency": "ARS", "exchange_rate": { "value": "10.00", "from": "USD" } }, "fees": [ { "type": "processing_fee", "amount": { "value": "5.00", "currency": "USD" } } ], "history": [ { "status": "needs_response", "transitioned_at": "2024-12-02T12:30:15.123Z", "retained_delta": { "value": "0.00", "currency": "USD" }, "retained_total": { "value": "0.00", "currency": "USD" }, "retained_settled_amount": { "value": "0.00", "currency": "ARS", "exchange_rate": { "value": "10.00", "from": "USD" } } }, { "status": "won", "transitioned_at": "2024-12-25T10:42:45.086Z", "retained_delta": { "value": "100.00", "currency": "USD" }, "retained_total": { "value": "100.00", "currency": "USD" }, "retained_settled_amount": { "value": "1000.00", "currency": "ARS", "exchange_rate": { "value": "10.00", "from": "USD" } } } ]}
```