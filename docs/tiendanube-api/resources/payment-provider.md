---
title: Payment Provider
source: https://tiendanube.github.io/api-documentation/resources/payment-provider
version: 2025-03
---

# Payment Provider

A Payment Provider, shorter name for Payments Services Provider, represents any entity which provides all the necessary resources and infrastructure for merchants and consumers to execute [Transactions](/api-documentation/resources/transaction) between them. This entities could be any of the following:

- **Aggregator**

- **Acquirer**

- **Gateway**

Payments companies have many different and sometimes complex features which add value to the purchase experience, mainly providing multiple payments options and simpler checkout flows. They also provide merchants with tools to make better management of their Transactions as well as their incomes.

In our platform, a Payment Provider is created for a specific `store`.

> ***Note:*** This endpoint is for the exclusive use of payment apps.

> ***Note:*** To create a Payments App you need to create an App in the Partners Portal and request our Partner Support Team ([partners@nuvemshop.com.br](mailto:partners@nuvemshop.com.br)/partners@tiendanube.com) to enable your app to access our Payments APIs.

## Properties

| Field | Type | Description 
| `id` | String | [Read-only] Unique identifier of the Payment Provider object. 
| `store_id` | Integer | [Read-only] Id of the store to which the Payment Provider belongs. 
| `app_id` | String | [Read-only] Id of the app to which the Payment Provider belongs. 
| `name` | String | Name to be displayed to merchants at the store admin tool. 
| `public_name` | String | [Optional] Name to be displayed to consumers at the storefront. If not specified, the same value as `name` is used. 
| `description` | String | Short paragraph which provides merchants with a description of the Payment Provider. 
| `logo_urls` | Object | Object containing `key:value` pair for each version of the logos for the frontend. Only supports HTTPS URLs. See [Logos](#logos). 
| `supported_currencies` | Array(String) | ISO.4217 currency codes supported by the Payment Provider. See [Currency Codes](#currency-codes). 
| `supported_payment_methods` | Array(Object) | List of available payment methods for each payment method type. See [Payment Methods](#payment-methods). 
| `checkout_js_url` | String | HTTPS URL of the JavaScript file to be included in the checkout frontend. See [Checkout](/api-documentation/resources/checkout). 
| `checkout_payment_options` | Array(Object) | Object containing the available payment options for the checkout frontend. See [Checkout Payment Options](#checkout-payment-options). 
| `configuration_url` | String | [Optional] HTTPS URL of the Payment Provider configuration UI. 
| `support_url` | String | [Optional] Payment Provider support site HTTPS URL. 
| `rates` | Array(Object) | [Optional] List of rates definitions for merchants by payment method type. See [Rates](#rates). 
| `rates_url` | String | [Optional] HTTPS URL of the Payment Provider's rate information site. 
| `features` | Array(String) | [Optional] List of features offered by the Payment Provider. See [Features](#features). 
| `enabled` | Boolean | [Optional] Indicates whether the Payment Provider is activated or deactivated in the store. Defaults to `true`. 
| `authentication` | Object | [Optional] Object containing the authentication method type and the store credentials to use on payment processing requests. See [Authentication](#authentication). 

> ***Note:*** All URLs must be secure URLs (https).

> ***Note:*** Read-only properties will only appear in our responses, which means that should not be part of the requests.

### Logos

At the moment, our platform requires two versions of the Payment Provider logo. Each image must be sent as a `key:value` pair, being the key the dimension of the image and the value, the HTTPS URL of its content.

| Dimension | URL Content Description 
| `400x120` | PNG file with transparent background. Dimensions not greater than 400px (width) x 120px (height). *(As of 01/01/2019)*. 
| `160x100` | PNG file with white background. Dimensions must be 160px (width) x 100px (height). *(As of 01/01/2019)*. 

### Currency Codes

Every amount value needs to be complemented by a currency. Supported currency codes must be specified according to [ISO 4217](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html).
The currencies currently supported on our platform are:

- `ARS`: Argentine Peso

- `AUD`: Australian Dollar

- `BOB`: Bolivian Boliviano

- `BRL`: Brazilian Real

- `CAD`: Canadian Dollar

- `CRC`: Costa Rican Colon

- `CLP`: Chilean Peso

- `CNY`: Chinese Yuan

- `COP`: Colombian Peso

- `EUR`: Euro

- `GBP`: British Pound

- `ILS`: Israeli New Shekel

- `INR`: Indian Rupee

- `JPY`: Japanese Yen

- `MXN`: Mexican Peso

- `PEN`: Peruvian Sol

- `PYG`: Paraguayan Guarani

- `RUB`: Russian Ruble

- `SEK`: Swedish Krona

- `USD`: US Dollar

- `VEF`: Venezuelan Bolivar

- `UYU`: Uruguayan Peso

- `ZAR`: South African Rand

### Payment Method Types

There are many companies providing payment methods of different types. Currently, our platform supports the following payment methods types.

| Payment Method Type | Description 
| `bank_debit` | Transaction in which the consumer uses bank debit as payment method. 
| `boleto` | Transaction in which the consumer uses a Boleto Bancário as payment method. Boleto is a Brazilian payment method based on cash. 
| `cash` | Transaction in which the consumer uses cash as payment method. 
| `credit_card` | Transaction in which the consumer uses a credit card as payment method (E.g. VISA, Mastercard, AMEX). 
| `debit_card` | Transaction in which the consumer uses a debit card as payment method (E.g. VISA Debit, Maestro). 
| `pix` | Transaction in which the consumer uses PIX as payment method. PIX is a Brazilian payment method based on transfers between financial institutions. 
| `ticket` | Transaction in which the consumer uses a ticket as payment method. This ticket can be paid through a non-bank collection channel (E.g. Rapipago, Pago Fácil, OXXO). 
| `wallet` | Transaction in which the consumer uses a wallet as payment method. A wallet is an application that allows you to transfer money. 
| `wire_transfer` | Transaction in which the consumer uses a wire transfer as payment method. 

### Payment Methods

Depending on the kind of Payment Provider (*Aggregator*, *Acquirer*, *Gateway*), they may integrate to our platform one or many payment methods for each payment method type.

If applicable, the installments data supported by the payment method type is detailed here.

| Field | Type | Description 
| `payment_method_type` | String | One of the available [Payment Method Types](#payment-method-types). 
| `payment_methods` | Array(String) | The list of supported payments method IDs by the given payment method type. See [Supported Payment Methods by Payment Method Type](#supported-payment-methods-by-payment-method-type). 
| `installments` | Object | [Optional] Object containing the installments available to consumers. See [Installments](#installments). 

#### Installments

Most Payment Providers provide different installment based payments options.

***Note:*** At the moment, installments are only allowed for `credit_card` payment method type.

| Field | Type | Description 
| `specification` | Array(Object) | Check [Specification](#specification) section below for a description of this field. 
| `min_installment_value` | Array(Object) | [Optional] List of minimum installment values accepted by each currency. See [Money](#money) for items format. 

> ***Note:*** An example for `min_installment_value` would be `"currency": "BRL` and `"amount": "5"` . For instance, if the total amount to be payed is `50 BRL`, then the consumer can choose to make the payment in up to 10 installments because the value of each of them would be `50 / 10 = 5`. However, the consumer won't be able to choose to spread the payment into 12 installments because `50 / 12 = 4.17` and `4.17 
| Field | Type | Description 
| `installments` | Integer | Number of installments. E.g. `3`. 
| `interest_rate` | String | Rate to be applied to the total amount for this installments option. E.g. `"0.015"`. 
| `applies_to` | Array(String) | [Optional] List of [supported values (banks, card brands, etc.)](#supported-payment-methods-by-payment-method-type) to which this installments option applies. 
| `minimum_purchase_value` | Array(Object) | [Optional] List of minimum purchase values from which this installment option applies by each currency. See [Money](#money) for items format. 

> ***Note:*** Interest rates are percentages expressed in fractions of 1 in `String` format for better decimal precision handling. For instance, an interest rate of `6.5%` would be expressed as `6.5 / 100 = 0.065`, which stringified would be "0.065".

> ***Note:*** An example for `minimum_purchase_value` would be `"currency": "ARS"` and `"value": "300.00"`. For instance, if the total amount to be paid is `400 ARS`, then the consumer can choose this installment option because `400 >= 300`. However, if the total amount is `250 ARS`, the consumer won't be able to choose this installment option because `250 
| Field | Type | Description 
| `payment_method_type` | String | Payment method type to which the rates definition refer. See [Payment Method Types](#payment-method-types). 
| `rates_definition` | Array(Object) | Object containing the rates details. See [Rates Definition](#rates-definition) section bellow. 

#### Rates Definition

| Field | Type | Description 
| `percent_fee` | String | Percentage fee charged per payment. E.g. `"1.250"`. 
| `days_to_withdraw_money` | Integer | Days since Transaction creation until de merchant can withdraw the money. 
| `flat_fee` | Object | [Optional] Object containing the flat fee charged per payment. See [Money](#money). 
| `plus_tax` | Boolean | [Optional] Indicates whether VAT will be added to the specified rates. 

### Features

Payment Providers can specify the list of functionalities of the service that they offer to the merchant. This will be displayed in the list of available payment applications together with the description of the Payment Provider in order to provide more detail about the application's features.

| Field | Type | Description 
| `features` | Array(String) | List of payment provider's features. See [Supported Feature Values](#supported-feature-values) below. 

#### Supported Feature Values

| Feature | Description 
| `special_rates` | The payment provider offers exclusive rates for Nuvemshop customers. 
| `transparent_checkout` | The payment provider offers transparent payment options (without leaving the store checkout). 
| `supports_international_payments` | The payment provider allows payments from foreign countries. 
| `gateway` | The payment provider offers gateway services. 

### Checkout Payment Options

This object contains the data that the Checkout's frontend needs to render the available payment options for the consumer.

Payment Providers can implement multiple payment options to display at the store checkout. To do this, apps must specify the configuration of their Checkout Payment Options through our REST API. The event handlers for each Checkout Payment Option must be defined in the JavaScript file indicated in the `checkout_js_url` field (check out the [Checkout Resource ](/api-documentation/resources/checkout#payment-options-javascript-interface) for more details on implementing this script).

| Field | Type | Description 
| `id` | String | Payment option UUID. It must be unique between payment providers of the same app and match the ID indicated in the `chechkout_js_url` file. 
| `name` | String | Payment option name to be displayed in the store checkout. 
| `description` | String | [Optional] Payment option description to be displayed in the store checkout. 
| `logo_url` | String | [Optional] HTTPS URL of the Payment Provider logo. 
| `supported_billing_countries` | Array(String) | List of [ISO_3166-1](https://es.wikipedia.org/wiki/ISO_3166-1) country codes where the payment option will be available. 
| `supported_payment_method_types` | Array(String) | Payment method types supported by the payment option. See [Payment Method Types](#payment-method-types). 
| `integration_type` | String | The integration type of the payment option. One of these values: `redirect` or ` transparent`. 

### Money

Sums of money will be represented by a value and its respective currency.

| Field | Type | Description 
| `value` | String | Amount of money as a string. E.g. `"49.99"` 
| `currency` | String | ISO 4217 code for the currency, such as ARS, BRL, USD, etc. 

> ***Note:*** Decimal numbers will be represented as string format for better decimal precision handling. It must contain two decimal places and use a point as decimal separator.

### Authentication

Authentication data related to the merchant's account to use in the payment requests to the Payment App's API. For more information about this feature, check out the [Secure App Payment Processing Flow](/api-documentation/guides/payment-provider#step-5-implement-the-payment-processing-flow) section of our Payment Provider App Development Guide.

| Field | Type | Description 
| `type` | String | Authentication method type. One of: `api_key`, `token`, `oauth` or `basic`. 
| `api_key` | String | [Required for API Key authentication] The value of the API key. 
| `access_token` | String | [Required for OAuth and Token authentication] The value of the merchant's access token. 
| `client_id ` | String | [Required for OAuth authentication] The value of the merchant's client ID. 
| `client_secret` | String | [Required for OAuth authentication] The value of the merchant's client secret. 
| `refresh_token` | String | [Required for OAuth authentication] The value of the merchant's refresh token. 
| `expires_at` | String | [Required for OAuth authentication] The expiration date of the merchant's access token. Note that if the token does not expire, you must implement simple Token-type authentication instead. 
| `refresh_token_url` | String | [Required for OAuth authentication] App URL that we will use to refresh the merchant's access token before it expires. 
| `username` | String | [Required for Basic authentication] Merchant account user value. 
| `password` | String | [Required for Basic authentication] Merchant account password value. 

#### Refreshing of merchant access tokens under the OAuth scheme

Assuming that we have the following authentication configuration defined in the Payment Provider:

```
{ "authentication":{ "type":"oauth", "access_token":"currentAcccessToken", "client_id":"clientId", "client_secret":"clientSecret", "expires_at":"2023-10-25T12:30:15.000Z", "refresh_token":"refreshToken", "refresh_token_url":"https://acme.com/oauth" }}
```

Then, we will attempt to perform the request for the merchant's access token refresh as following:

```
curl --location --request POST 'https://acme.com/oauth' \--header 'Content-Type: application/json' \--header 'Accept: application/json' \--data-raw '{ "grant_type": "refresh_token", "client_id": "clientId", "client_secret":"clientSecret", "refresh_token":"refreshToken"}'
```

And we expect a response complying with the OAuth authentication standard:

```
{ "access_token":"newAccessToken", "refresh_token":"newRefreshToken", "expires_in": 10519200}
```

The refresh request response must define at least the fields `access_token` and `refresh_token`, with the values of the new merchant's tokens, and `expires_in`, indicating the time in seconds in which the new *access token* expires. Optionally, new values of `client_id`, `client_secret` and `refresh_token_url` can be included. We will then update the values of the Payment Provider with the new values, calculating the new `expires_at` date from the `expires_in` value received in the response.

## Endpoints

### POST /payment_providers

Create a Payment Provider for a given store.

Request

[Payment Provider Object](#properties)

E.g.

```
{ "name": "My Payments", "public_name": "Pay with My Payments", "description": "Some short description for merchants.", "logo_urls": { "400x120": "https://mypayments.com/logo1.png", "160x100": "https://mypayments.com/logo2.png" }, "configuration_url": "https://mypayments.com/configuration", "support_url": "https://mypayments.com/support", "rates_url": "https://mypayments.com/rates", "checkout_js_url": "https://mypayments.com/checkout.min.js", "supported_currencies": ["ARS", "BRL"], "supported_payment_methods": [ { "payment_method_type": "credit_card", "payment_methods": ["visa", "mastercard", "amex", "diners"], "installments": { "min_installment_value": [ { "currency": "ARS", "value": "100.00" } ], "specification": [ { "installments": 1, "interest_rate": "0.00", "applies_to": ["bbva", "itau", "santander", "galicia", "icbc"] }, { "installments": 3, "interest_rate": "0.00", "applies_to": ["bbva", "itau"], "minimum_purchase_value": [ { "value": "300.00", "currency": "ARS" } ] }, { "installments": 6, "interest_rate": "0.045", "applies_to": ["santander", "galicia"], "minimum_purchase_value": [ { "value": "500.00", "currency": "ARS" }, { "value": "100.00", "currency": "BRL" } ] }, { "installments": 12, "interest_rate": "0.15", "applies_to": ["icbc"] } ] } }, { "payment_method_type": "debit_card", "payment_methods": ["visa_debit", "maestro"] }, { "payment_method_type": "boleto", "payment_methods": ["boleto", "banco_do_brasil", "bradesco", "caixa"] } ], "rates": [ { "payment_method_type": "credit_card", "rates_definition": [ { "percent_fee": "2.25", "flat_fee": { "value": "1.00", "currency": "ARS" }, "plus_tax": true, "days_to_withdraw_money": 10 }, { "percent_fee": "3.99", "flat_fee": { "value": "2.50", "currency": "BRL" }, "plus_tax": false, "days_to_withdraw_money": 5 } ] } ], "checkout_payment_options": [ { "id": "mypayments_transparent_card", "name": "My Payments Card", "description": "Some description for transparent card option", "logo_url": "https://cdn.mypayments.com/apps/tiendanube/logo.png", "supported_billing_countries": ["AR"], "supported_payment_method_types": ["credit_card", "debit_card"], "integration_type": "transparent" }, { "id": "mypayments_transparent_offline", "name": "My Payments Boleto", "description": "Some description for transparent offline option", "logo_url": "https://cdn.mypayments.com/apps/tiendanube/logo.png", "supported_billing_countries": ["BR"], "supported_payment_method_types": ["boleto"], "integration_type": "transparent" }, { "id": "mypayments_redirect", "name": "My Payments External", "description": "Some description for external option", "logo_url": "https://cdn.mypayments.com/apps/tiendanube/logo.png", "supported_billing_countries": ["AR", "BR"], "supported_payment_method_types": [ "credit_card", "wire_transfer", "wallet" ], "integration_type": "redirect" } ], "features": ["special_rates", "transparent_checkout", "gateway"], "enabled": true, "authentication": null}
```

Response

`HTTP/1.1 201 Created`

E.g.

```
{ "id": "6e760b6e-e4f3-42ba-8a2d-afddf44e6cf1"}
```

Unique identifier of the created Payment Provider.

### PUT /payment/providers/{payment_provider_id}

Update a Payment Provider for a given store. This is especially useful to update the installments specs.

Request

[Payment Provider Object](#properties)

Response

`HTTP/1.1 204 No Content` - the request was successful but there is no representation to return (i.e. the response is empty).

### GET /payment_providers

Get all Payment Providers for a given store.

Request

```
{}
```

Response

`HTTP/1.1 200 OK`

Array of [Payment Provider Objects](#properties)

### GET /payment/providers/{_payment_provider_id}

Get a specific Payment Provider for a given store.

Request

```
{}
```

Response

`HTTP/1.1 200 OK`

[Payment Provider Object](#properties)

### DELETE /paymentproviders/{_payment_provider_id}*

Delete a Payment Provider for a given store.

Request

```
{}
```

Response

`HTTP/1.1 204 No Content` - the request was successful but there is no representation to return (i.e. the response is empty).

## HTTP Errors List

- **400 Bad Request** - the request could not be understood or was missing required parameters.

- **401 Unauthorized** - authentication failed or user doesn't have permissions for requested operation.

- **403 Forbidden** - access denied.

- **404 Not Found** - resource was not found.

- **405 Method Not Allowed** - requested method is not supported for resource.

## Appendix

### Supported Payment Methods by Payment Method Type

The following is the list of payment method IDs by payment method type currently supported by our platform.

| Payment Method Type | Payment Method ID 
| `bank_debit` | See the [Supported Bank list](#supported-banks). 
| `boleto` | See the [Supported Bank list](#supported-banks). Use the default value `boleto` if no issuer is specified. 
| `cash` | `cash` 
| `credit_card` | `amex`, `argencard`, `aura`, `cabal`, `cencosud`, `codensa`, `cordial`, `cordobesa`, `diners`, `discover`, `elo`, `falabella`, `hiper`, `hipercard`, `hsbc_access_now`, `magna`, `mastercard`, `nativa`, `oi_paggo`, `provencred`, `rebanking`, `sucredito`, `tarjeta_naranja`, `tarjeta_saenz`, `tarjeta_shopping`, `tarjeta_walmart`, `tuya`, `visa` 
| `debit_card` | `cabal_debit`, `maestro`, `visa_debit`, `mastercard_debit`, `vr-beneficios`, `sodexo`, `alelo` 
| `pix` | `pix` 
| `ticket` | `efecty`, `oxxo`, `pagofacil`, `rapipago`, `servipag`, `seven_eleven`, `via_baloto` 
| `wallet` | `daviplata`, `nequi`, `wallet` 
| `wire_transfer` | `banelco`, `link`, `provincia_net`, `pse`, `spei`, `transfiya` 

#### Supported Banks

`banamex`, `banco_chaco`, `banco_chubut`, `banco_ciudad`, `banco_coinag`, `banco_columbia`, `banco_comafi`, `banco_comercio`, `banco_consorcio`, `banco_de_chile`, `banco_do_brasil`, `banco_do_nordeste`, `banco_entre_rios`, `banco_estado`, `banco_falabella`, `banco_hipotecario`, `banco_industrial`, `banco_internacional`, `banco_la_pampa`, `banco_municipal`, `banco_nacion`, `banco_paris`, `banco_patagonia`, `banco_provincia`, `banco_ripley`, `banco_san_juan`, `banco_santa_cruz`, `banco_santa_fe`, `banco_security`, `banco_tierra_del_fuego`, `banco_tucuman`, `banrisul`, `bbva`, `bci`, `bica`, `bice`, `binance`, `bitso`, `bradesco`, `brubank`, `caixa`, `citi`, `coopeuch`, `corpbanca`, `galicia`, `hsbc`, `icbc`, `itau`, `macro`, `rabobank`, `santander`, `scotiabank`, `sicoob`, `sicredi`, `supervielle`