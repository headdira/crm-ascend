---
title: Payment Option
source: https://tiendanube.github.io/api-documentation/resources/payment-option
version: 2025-03
---

# Payment Option

A [Payment Provider](/api-documentation/resources/payment-provider) can implement multiple payment options to be available at the checkout of a store. Payment options are the different alternatives through which a consumer can pay for their order in the store. These options can be integrated in the store checkout in two ways:

- **transparent integration:** the payment through this option is processed within the checkout of the store;

- **redirect integration:** by using this option, the consumer is redirected to an external checkout provided by the payment provider.

## Properties

| Field | Type | Description 
| `id` | String | Unique identifier of the payment provider. 
| `name` | String | Name of the payment provider. 
| `checkout_payment_options` | Array(Object) | List of checkout payment options supported by the payment provider. See [Checkout Payment Options](#checkout-payment-options). 
| `logo_url` | String | [Optional] HTTPS URL of the payment provider logo. 

### Checkout Payment Options

| Field | Type | Description 
| `id` | String | Unique identifier of the payment option. 
| `name` | String | Name of the payment option. 
| `supported_payment_method_types` | Array(String) | Payment method types supported by the payment option. See [Payment Method Types](/api-documentation/resources/payment-provider#payment-method-types). One of these values: `bank_debit`; `boleto`; `cash`; `credit_card`; `debit_card`; `other`; `pix`; `ticket`; `wallet`; `wire_transfer`. 
| `integration_type` | String | [Optional] The integration type of the payment option. One of these values: `redirect` or ` transparent`. 

## Endpoints

### GET /payment-options

Get the payment options available for the checkout of a store based on the Payment Providers activated by the merchant.

Response

`HTTP/1.1 200 OK`

Array of [Payment Option Objects](#properties)

```
[ { "id":"mercadopago", "name":"Mercado Pago", "logo_url":"https://static.tiendanube.com/admin/img/payments/mercadopago.png", "checkout_payment_options":[ { "id":"mercadopago_transparent_card", "name":"Tarjeta de crédito y débito", "supported_payment_method_types":[ "credit_card", "debit_card" ], "integration_type":"transparent" }, { "id":"mercadopago_transparent_offline", "name":"Efectivo", "supported_payment_method_types":[ "ticket" ], "integration_type":"transparent" }, { "id":"mercadopago_redirect", "name":"Mercado Pago", "supported_payment_method_types":[ "credit_card", "debit_card", "ticket", "wallet" ], "integration_type":"redirect" } ] }, { "id":"f7daed05-512b-4c91-acbc-1d1bb1dcc154", "name":"GOcuotas", "logo_url":"https://gocuotas.com/assets/logo2.png", "checkout_payment_options":[ { "id":"gocuotas_redirect_payment", "name":"GOcuotas - Pagá en CUOTAS con tarjeta de DÉBITO y SIN interés.", "supported_payment_method_types":[ "debit_card" ], "integration_type":null } ] }, { "id":"dd55455e-de03-4c0e-8da9-0e635f8bc0ec", "name":"Fresa", "logo_url":"https://res.mobbex.com/tiendanube/fresa-logo-160x100px.png", "checkout_payment_options":[ { "id":"mobbex_gateway_external", "name":"Fresa", "supported_payment_method_types":[ "credit_card", "debit_card" ], "integration_type":"redirect" } ] }, { "id":"1a9d690f-5f66-4acf-b7c6-69f2cb98149e", "name":"Pago Nube", "logo_url":"https://services-financials-payments-new-admin-app.tiendanube.com/assets/img/pago-nube-card-logo.png", "checkout_payment_options":[ { "id":"nuvempago_transparent_card", "name":"Pago Nube", "supported_payment_method_types":[ "credit_card", "debit_card" ], "integration_type":"transparent" } ] }]
```