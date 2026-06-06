---
title: Business Rules
source: https://tiendanube.github.io/api-documentation/resources/business-rules
version: 2025-03
---

# Business Rules

The Business Rules API offers the ability to define different business behaviours for the `shipping`, `payments` and `cart` domains through a set of conditions.

When the merchant installs the app, the app must authenticate with `Nuvemshop` and create and individual `Callback` for the domain it supports and for the store that triggered the installation. These Callbacks represent the URL that we are going to consult when applying the rules to know what shipping options, payment options, etc. are applied at checkout.

In our platform, a Callback is created for a specific `store`.

> ***Note:*** To create a Business Rules App you need to create an App in the Partners Portal and request our Partner Support Team ([partners@nuvemshop.com.br](mailto:partners@nuvemshop.com.br) or [partners@tiendanube.com](mailto:partners@tiendanube.com)) to enable your app to access our APIs.

## Installation flow

Below we have the definition of the API to integrate a new business rule provider. This API is what the partner will use in the installation flow to register with the corresponding configuration.
We can see that the URL is composed of the `store_id` and the domain to which the app corresponds and a token related to the installation of the app. Returns the No Content status on success.

### Callback

| Field | Type | Description 
| `url` | String | HTTPS URL where the data will be sent. 
| `event` | String | Event the application will listen. See [Events](#events). 
| `domain` | String | Domain in which the event occurs. See [Domains](#domains). 

### Domains

There are multiple domains supported on our platform. The app requires certain mandatory scopes in order to work with each domain, as follows:

- `payments`: Requires the scopes: `read_payment_options`, `read_payments`.

- `shipping`: Requires the scopes: `read_shipping`.

- `location`: Requires the scopes: `read_locations`

- `cart`: No mandatory scopes required.

### Events

The events supported on our platform are:

- `payments/before-filter`: Event to filter payments options.

- `shipping/before-filter`: Event to filter shipping options.

- `location/prioritization`: Event for location prioritization.

- `cart/before-finish`: Event to block checkout completion.

### Endpoint to create a Callback

Create a callback for a given store.

- URL: `/{*store_id*}/business_rules/integrations/{*domain*}`

- Method: `PUT`

Request

[Callback Object](#callback)

E.g.

```
{ "url": "https://my_payments_callback.com", "event": "payments/before-filter"}
```

Response

`HTTP/1.1 204 No Content`

## Partner's API

In this section we explain that the partner's API must offer an endpoint with the following payload and response definitions. This endpoint represents the callbacks previously mentioned the partner must create.

### Callback payload format definition

| Field | Type | Required | Description 
| `store_id` | String | True | Store where the operation took place. 
| `cart_id` | Number | if details.action is add | Id of the cart related to the operation. 
| `currency` | String | True | ISO code of the currency of the cart. 
| `details` | [Details](#details) | True | Contains all the information related to the event. 
| `products` | [Products](#products) | True | Contains all the information related to products. 
| `customer` | [Customer](#customer) | True | Contains all the information related to the customer. 
| `shipping` | [Shipping](#shipping) | if details.domain is shipping | Contains all the information related to the shipping. 
| `package` | [Package](#package) | if details.domain is shipping | Contains all the information related to the shipping package. 
| `locations` | `array` | if details.domain is location | Contains all the information related to the locations. 
| `totals` | [Totals](#totals) | if details.domain is payments, shipping, or cart | Contains all the information related to the amount to be charged to the consumer. 

#### Details

| Field | Type | Required | Description 
| `event` | String | True | Represents the moment where the event must be triggered to perform the action. One of: `shipping/before-filter`, `payments/before-filter`, `location/prioritization`, `cart/before-finish`. 
| `action` | String | True | Represents the action to perform. One of: `filter`. 
| `domain` | String | True | Represents the domain in which the action take place. One of: `cart`, `shipping`, `payments`, `locations`. 
| `timestamp` | Number | True | Update time. 

#### Products

| Field | Type | Required | Description 
| `id` | Number | True | Id of the product line item. 
| `product_id` | Number | True | Id of the product. 
| `quantity` | Number | True | Number of products. 
| `stock` | Number | True | Number of products left. 
| `variant_id` | Number | True | Id of the product variant. 
| `price` | String | True | Price of the product. 
| `categories` | `Array` | True | Product Categories. 

#### Categories

| Field | Type | Required | Description 
| `id` | Number | True | Id of the category. 
| `parent` | Number | False | Id of the parent Category. 
| `subcategories` | `Array` | True | Ids of subcategories. 

#### Customer

| Field | Type | Required | Description 
| `id` | Number | False | Id of the customer who performed the operation. 
| `name` | String | False | Full name of the customer. 
| `email` | String | False | Email address of the customer. 
| `phone` | String | False | Phone number of the customer. 
| `document` | String | False | Tax document of the customer (e.g. CPF/CNPJ). 
| `zipcode` | String | False | Shipping zip code of the customer. 

#### Shipping

| Field | Type | Required | Description 
| `country` | String | False | Country of the place to send the product. 
| `city` | String | False | City of the place to send the product. 
| `postalcode` | String | False | Postal code of the place to send the product. 
| `cost` | String | False | Shipping cost to send the product. 

#### Package

| Field | Type | Required | Description 
| `weight` | String | True | Weight of the package to send. 

#### Totals

| Field | Type | Required | Description 
| `subtotal` | String | True | Subtotal of the cart. 
| `total_discount` | String | True | Total discount of the cart. 
| `total` | String | True | Total of the cart. 

#### Examples

Shipping Payload

E.g.

```
{ "store_id": "92760", "cart_id": 397256730, "details": { "event": "shipping/before-filter", "action": "filter", "domain": "shipping", "timestamp": 111111111111 }, "products": [ { "id": 467422732, "product_id": 645, "price": "12.00", "quantity": 4, "stock": 5, "variant_id": 33739098, "categories": [ { "id": 11353744, "parent": null, "subcategories": [ 11353746, 11353747 ] }, { "id": 11353747, "parent": 11353744, "subcategories": [] } ] } ], "customer": { "id": null }, "shipping": { "country": "AR", "city": "CABA", "postalcode": "1414", "cost": "0.0" }, "package": { "weight": "0.600" }, "currency": "ARS", "totals": { "subtotal": "30000.00", "total_discount": "10300.00", "total": "19700.00" }}
```

Payments Payload

E.g.

```
{ "store_id": "92760", "cart_id": 397256730, "details": { "event": "payments/before-filter", "action": "filter", "domain": "payments", "timestamp": 111111111111 }, "products": [ { "id": 467422732, "product_id": 645, "price": "12.00", "quantity": 4, "stock": 5, "variant_id": 33739098, "categories": [ { "id": 11353744, "parent": null, "subcategories": [ 11353746, 11353747 ] }, { "id": 11353747, "parent": 11353744, "subcategories": [] } ] } ], "customer": { "id": null }, "currency": "ARS", "totals": { "subtotal": "30000.00", "total_discount": "10300.00", "total": "19700.00" }}
```

Cart Payload

E.g.

```
{ "store_id": "92760", "cart_id": 397256730, "details": { "event": "cart/before-finish", "action": "filter", "domain": "cart", "timestamp": 111111111111 }, "products": [ { "id": 467422732, "product_id": 645, "price": "12.00", "quantity": 4, "stock": 5, "variant_id": 33739098, "categories": [ { "id": 11353744, "parent": null, "subcategories": [ 11353746, 11353747 ] }, { "id": 11353747, "parent": 11353744, "subcategories": [] } ] } ], "customer": { "id": 123456, "name": "John Doe", "email": "john.doe@example.com", "phone": "+5411987654321", "document": "12345678901", "zipcode": "1414" }, "shipping": { "country": "AR", "city": "CABA", "postalcode": "1414", "cost": "0.0" }, "package": { "weight": "0.600" }, "currency": "ARS", "totals": { "subtotal": "30000.00", "total_discount": "10300.00", "total": "19700.00" }}
```

Locations Payload

E.g.

```
{ "store_id": "1", "cart_id": 397256730, "details": { "event": "location/prioritization", "action": "prioritization", "domain": "location", "timestamp": 111111111111 }, "products": [ { "id": 467422732, "product_id": 645, "price": "12.00", "quantity": 4, "stock": 5, "variant_id": 33739098, "categories": [ { "id": 11353744, "parent": null, "subcategories": [ 11353746, 11353747 ] }, { "id": 11353747, "parent": 11353744, "subcategories": [] } ] } ], "customer": { "id": null }, "shipping": { "country": "BR", "province": "SP", "city": "Bragança Paulista", "postalcode": "12916540", "cost": "0.0" }, "package": { "weight": "0.600" }, "locations": [ { "id": "location id", "name": "location name", "address": { "zipcode": "12916540", "street": "Rua Professor Milton Improta", "number": "95", "floor": "95", "locality": "Jardim do Sul", "reference": null, "between_streets": null, "country": "BR", "region": "Sudeste", "province": "SP", "city": "Bragança Paulista" }, "priority": 0 } ], "currency": "ARS", "totals": { "subtotal": "30000.00", "total_discount": "10300.00", "total": "19700.00" }}
```

### Callback response format definition

| Field | Type | Required | Description 
| `command` | String | True | Represents the name of the command to apply. One of: `filter_shipping_options`, `filter_payments_options`, `location_prioritization`, `block_checkout`. 
| `detail` | `Array Array Object` | True | Options to be filtered, Location prioritization, or an empty object when command is `block_checkout`. 

**Important**: This API has a timeout of 800ms.
If no response is received within this timeframe, the request will timeout, and it will be treated as if no rule was returned.

#### Location Prioritization

Location prioritization is crucial for order fulfillment in our cart distribution process. Below are scenarios describing how we select Distribution Centers (DCs) during the checkout process:

**Scenario 1:**
Given a cart with 3 Products
Given the priority order of DCs: DC 2, DC 1, and DC 3
Given DC 1 has Product 1, DC 2 has Product 1 and Product 2, DC 3 has Product 1, Product 2, and Product 3
Given the option "maximize shipment quantity" is active
Then the shipment quantity election result will be 1, starting from DC 3. Despite being the lowest priority, DC 3 can fulfill shipment for all products in the order.

**Scenario 2:**
Given a cart with 2 Products
Given the priority order of DCs: DC 2, DC 1, and DC 3
Given DC 1 has Product 1, DC 2 has Product 2, DC 3 has only Product 1
Given the option "maximize shipment quantity" is active
Then the shipment quantity election result will be 2, starting from DC 1 and DC 2, as no single DC alone can fulfill shipment for all products due to their priority order.

**Scenario 3:**
Given a cart with 3 Products
Given the priority order of DCs: DC 2, DC 1, and DC 3
Given DC 1 has Product 1, DC 2 has Product 1 and Product 2, DC 3 has Product 1, Product 2, and Product 3
Given the option "maximize shipment quantity" is not active
Then the shipment quantity election result will be 2, starting from DC 1 and DC 2. Even though DC 3 could be the starting point for shipment of all products, maximizing option was not enabled.

**Scenario 4:**
Given a cart with 3 Products
When consulting the partner results in Response Status Code 201 but an empty prioritized DCs list
Then the shipment quantity election result will be 0, indicating the purchase cannot be completed as there is no designated starting point for shipment. This scenario indicates a failure in prioritization rules preventing shipment to the consumer destination.

**Scenario 5:**
Given a cart with 3 Products
When consulting the partner results in a failure (e.g., downtime, non-2xx response status code, invalid payload format or and for requests that take longer than 1 second)
Then default prioritization set by the merchant via the locations API will be used. This contingency approach ensures no sales are lost due to unexpected issues, utilizing standard prioritization rules.

**Note:**

- The script considers not only DCs possessing the Products but also sufficient quantities to fulfill the consumer's cart.

- Even digital products (non-shippable) adhere to inventory control rules with assigned quantities and DCs, following the same prioritization rules as physical products.

**This documentation provides clarity on how location prioritization influences shipment decisions during checkout, ensuring efficient and reliable order fulfillment.**

##### Location Prioritization

| Field | Type | Is Mandatory | Description 
| `id` | String | TRUE | Id of location. 
| `priority` | number | TRUE | priority for location. 

##### Examples

Location prioritization response

E.g.

```
{ "command": "location_prioritization", "detail": { "location_prioritization": [ { "id": "01HRAE6GV84TH5JPPK0A1FNTRF", "priority": 0 }, { "id": "01HRAEPHCXSGY68V29YJPGTX3M", "priority": 1 } ] }}
```

#### Filtered Option

##### Shipping Filtered Option

| Field | Type | Required | Description 
| `id` | String | True | Id of the shipping carrier. 
| `option_id` | String | True | Id of the shipping option. 
| `code` | String | True | Code of the shipping option. 

##### Payments Filtered Option

| Field | Type | Required | Description 
| `id` | String | True | Id of the payment provider. 
| `option_id` | String | True | Id of the payment option. 

##### Cart Checkout Block

When the command is `block_checkout`, the `detail` field must be an empty object. The checkout will prevent the customer from completing the purchase.

##### Examples

Payments response

E.g.

```
{ "command": "filter_payments_options", "detail": { "filtered_options": [ { "id": "70827221-7e59-4c33-bd8c-591f7bad771b", "option_id": "custom_payment_wire_transfer_production" }, { "id": "4bf171b5-ab00-4a94-88b9-b1feffcaa99e", "option_id": "nuvempago_transparent_card" } ] }}
```

Shipping response

E.g.

```
{ "command": "filter_shipping_options", "detail": { "filtered_options": [ { "id": "5bf197053ae0c79f965b4c487fb39c4e", "option_id": "3287330", "code": "Andreani2" }, { "id": "526d880410a07611e20d8e14908facbe", "option_id": "6534532", "code": "table-6534532" } ] }}
```

Cart checkout block response

E.g.

```
{ "command": "block_checkout", "detail": {}}
```

##### Endpoints your app may use to consume data

The endpoints included in this section are available in the `Nuvemshop` API.

###### Payment options

###### GET {store_id}/payment_providers/options

> ***Note:*** Required Scope: read_payments

Header format

```
{ "Authentication": "bearer "}
```

Response Format

```
[ { "id": "", "name": "", "logo_url": "", "checkout_payment_options": [ { "id": "", "name": "", "supported_payment_method_types": "Array", "integration_type": "", "translation_key": "" } ] }]
```

`HTTP/1.1 200 Ok`

###### Shipping options

###### GET {store_id}/shipping_carriers/options

> ***Note:*** Required Scope: read_shipping

Header format

```
{ "Authentication": "bearer "}
```

Response Format

```
[ { "id": "", "name": "", "options": [ { "id": "", "name": "", "code": "", "allow_free_shipping": "" } ] }]
```

`HTTP/1.1 200 Ok`