---
title: Billing
source: https://tiendanube.github.io/api-documentation/resources/billing
version: 2025-03
---

# Billing

## Introduction

This section of the API enables you to:

- Manage the **plans** you offer to your service’s users.

- Handle **subscriptions** for your customers. This will be used to create the charges for your fixed fee periodically.

- Create **extra charges** to bill for any additional expenses related to your service.

## Entities

- ### Plan

A plan defines the level of service a customer can subscribe to and is part of the pricing model. Each plan may include different features, limits, and prices.

- ### Subscriptions

A subscription is the link between the customer (or “merchant”) and the service. It automatically generates periodic charges to cover the service’s cost. The field `next_execution` on the subscription informs the date when the new charge will be created.

- ### Business Unit

Represents the partner. Each Business Unit can define its own plans with its own pricing model for a given service.

- ### Service (also known as Business Unit Service)

The service provided by a Business Unit. An application created by a partner would be the “Service”.

### Example in Context

- The customer is the *Merchant*.

- The application is the *Service* (for example when an endpoint asks for the service_id, in this case would be the app_id).

- The partner who created the app is the *Business Unit*.

- The entity that creates the charges for the service is the *Subscription*.

- The periodic fee associated with that subscription corresponds to a *Plan*.

## Plans

As a partner, you can offer multiple plans for your service with different features, limits, and prices to meet the needs of different users. When a merchant is subscribed to a specific plan, the subscription will generate the corresponding charges, and your application should enable or restrict functionalities based on the plan.

### Endpoints

- **POST** `/plans`
Creates a new plan.

⚠️📝 *Note:* This endpoint uses the Partner-Action authentication method [see here](/api-documentation/next/guides/authentication-for-partner-actions#making-a-request).

#### Body

ParameterTypeExplanationcodestringCurrency code of the subscriptionexternal_reference?stringOptional, field left open for you to set up your own iddescription?stringOptional, short description of the plan
Response

```
{ "id": "string", "code": "string", "external_reference": "string", "description": "string", "default": "boolean",}
```

Failed Responses
`HTTP/1.1 404 Error -> Business Unit not found`

- `HTTP/1.1 404 Error -> Service not found`

- `HTTP/1.1 400 Error -> Duplicated externalReference for this service`

- **PATCH** `/plans/{plan_id}`
Updates an existing plan.
**IMPORTANT:** Updating a plan will modify all subscriptions to that plan, and all charges created but not already paid or waiting for payment.

⚠️📝 *Note:* This endpoint uses the Partner-Action authentication method [see here](/api-documentation/next/guides/authentication-for-partner-actions#making-a-request).

#### URL parameters

ParameterExplanationplan_idID of the plan to patch or your external_reference

#### Body

ParameterTypeExplanationcodestringCurrency code of the subscriptionexternal_referencestringField left open for you to set up your own iddescriptionstringShort description of the plan
Response

```
{ "id": "string", "code": "string", "external_reference": "string", "description": "string", "default": "boolean",}
```

Failed Responses
`HTTP/1.1 404 Error -> Business Unit not found`

- `HTTP/1.1 404 Error -> Service not found`

- `HTTP/1.1 404 Error -> Plan not found`

- **DELETE** `/plans/{plan_id}`
Deletes a plan.
**IMPORTANT:** Deleting a plan will delete all subscriptions to that plan, and all charges created but not already paid or waiting for payment.

⚠️📝 *Note:* This endpoint uses the Partner-Action authentication method [see here](/api-documentation/next/guides/authentication-for-partner-actions#making-a-request).

#### URL parameters

ParameterExplanationplan_idID of the plan to patch or your external_reference
Failed Responses
`HTTP/1.1 404 Error -> Business Unit not found`

- `HTTP/1.1 404 Error -> Service not found`

- `HTTP/1.1 404 Error -> Plan not found`

- `HTTP/1.1 400 Error -> Could not delete a default plan`

## Subscriptions

The idea of a subscription only makes sense if the service is not free. Each user (merchant) utilizing your paid service will have an associated subscription. This subscription periodically generates charges for the fixed cost of the service. To handle variable or additional charges, you can use the dedicated API endpoint (see the “Charges” section below).

Key points about subscriptions:

> **IMPORTANT** ⚠️ The date `next_execution` is the day when the next charge will be created automatically. This date is important because it marks the start of the next billing period

- They are created automatically when the merchant installs the app (or when the service is activated).

- They are updated based on certain events automatically [(more on this here)](#webhooks):

Free days are added

- The charge for the next period is created and the `next_execution` date is updated

- In some cases you’ll need to update them manually via the API:

You want to give an special price for a client

#### Billing Cycle

A subscription automatically creates charges for the next billing period but always attempts to align that period with the 16th day of the month.
For example

- If a merchant installs an application on the 2nd, the next charge will cover the period from that day until the 16th of that month, with a prorated fee for those days.

- If a merchant installs an application on the 20th, the next charge will cover the period from that day until the 16th of the next month, with a prorated fee for those days.

- If a merchant installs an application on the 16th (already aligned with the desired period), the next charge will cover the period from that day until the 16th of the next month, with the full price.

### Endpoints

- **GET** `/concepts/{concept_code}/services/{service_id}/subscriptions`
Retrieves the subscription for a specific user.

#### URL parameters

ParameterExplanationconcept_codeConcept code of the subscription to retrieveservice_idID of the service; If the service is an app, the app_id
Response

```
{ "external_reference": "string", "description": "string", "recurring_frequency": "string", "recurring_interval": "number", "amount_currency": "string", "amount_value": "number", "concept_code": "string", "store_id": "number", "next_execution": "Date", "last_execution": "Date", "plan": { "id": "UUID", "code": "string", }}
```

Failed Responses
`HTTP/1.1 404 Error -> Store not found`

- `HTTP/1.1 404 Error -> Subscription not found`

- **PATCH** `/concepts/{concept_code}/services/{service_id}/subscriptions`
Updates subscription details (for example, switching the plan a user is subscribed to).
**IMPORTANT**: Updating a subscription's price will update all charges created but not already paid or waiting for payment.

#### URL parameters

ParameterExplanationconcept_codeConcept code of the subscription to patchservice_idID of the service; If the service is an app, the app_id

#### Body

ParameterTypeExplanationamount_currencystringCurrency code of the subscriptionamount_valuenumberPrice of the subscriptionplan_idUUIDID of the plan associated with the subscriptionplan_external_idstringPartner's ID of the plan associated with the subscription
Response

```
{ "external_reference": "string", "description": "string", "recurring_frequency": "string", "recurring_interval": "number", "amount_currency": "string", "amount_value": "number", "concept_code": "string", "store_id": "number", "next_execution": "Date", "last_execution": "Date", "plan": { "id": "UUID", "code": "string", }}
```

Failed Responses
`HTTP/1.1 404 Error -> Store not found`

- `HTTP/1.1 404 Error -> Subscription not found`

- `HTTP/1.1 400 Error -> Invalid currency for store`

### Webhooks

You can configure webhooks to stay informed about significant subscription events, such as `next_execution` date changes. For this you'll first need to configure a listener for the event `subscription/updated`, then every time there's an update we'll send a notification to the `url` you provided. With this, you can use the information in the webhook to fetch the modified subscription, see what's new and handle the update.

**To learn more about setting up a webhook listener [go here](/api-documentation/resources/webhook)**
**To see more info about this specific webhook [go here](/api-documentation/resources/webhook#subscriptionupdated)**

## Charges

If your pricing model includes a fixed fee plus variable charges, the subscription will generate the fixed fee automatically. However, additional or variable charges must be created via the “Charges” API.
If your pricing model consist only of variable charges, you will not have a subscription (because there is no periodic fee) and the extra charges should be created via this API.

**Recommendation:**

> **Create these variable charges one day before** the subscription’s `next_execution`, and ensure they correspond to the same billing period. This allows the merchant to see all charges together, providing a smoother payment experience and reducing confusion.

### Endpoint

- **POST** `/services/{service_id}/charges`
Creates an additional charge (e.g., extra usage not included in the fixed fee).

#### URL parameters

ParameterExplanationservice_idID of the service; If the service is an app, the app_id

#### Body

ParameterTypeExplanationdescriptionstringShort description for the chargeexternal_reference?stringThis field is open if you want to use it as an id for the chargefrom_datedateDate of the start of the periodto_datedateDate of the end of the periodamount_valuenumberPrice of the chargeamount_currencystringCurrency code of the subscriptionconcept_codestringConcept code for the charge
Response

```
{ "id": "UUID", "description": "string", "external_reference": "string", "from_date": "date", "to_date": "date", "amount_value": "number", "amount_currency": "string", "concept_code": "string",}
```

Failed Responses
`HTTP/1.1 404 Error -> Store not found`

## Final Notes

- Implement robust error handling and notify users if an operation cannot be completed.

- Provide clear documentation about your plans (pricing, limits, benefits) so merchants can make informed decisions.