---
title: Checkout SDK
source: https://tiendanube.github.io/api-documentation/resources/checkout_sdk
version: 2025-03
---

# Checkout SDK

This library allows you to customize the checkout, through the methods below

## Events

### Line Items Updated

> This event will inform you that the cart items have been updated.

```
window.SDKCheckout.subscribeEvent('LINE_ITEMS_UPDATED', (event, data) => { console.log(event); // LINE_ITEMS_UPDATED console.log(data); // [{ "id": 1, "variant_id": 1, "name": "Product", "unit_price": 12, "quantity": 1, "sku": "prod-1", "is_ahora_12_eligible": true }]});
```

## Payments customization

### Renders in the console the list of ids of active gateways in the store.

> These ids can be used in the methods below to customize them

```
window.SDKCheckout.getPaymentIds()
```

Example:

```
['mercadopago_transparent_card', 'pagseguro_transparent_debit', 'mercadopago_transparent_offline', 'mercadopago_transparent_pix', 'custom', 'pagseguro_redirect', 'cielo_redirect', 'mercadopago_redirect', 'ame_digital']
```

### Hide payment options

> An array with the ids of the gateways you want to hide

```
window.SDKCheckout.hidePaymentOptions(['{{gateway_id}}', '{{gateway_id}}'])
```

### Adds or changes discount and installment information for a gateway

```
window.SDKCheckout.changePaymentBenefit({ id: '{{gateway_id}}', value: '12x sem juros' })
```

### Adds extra information to the content of the external payment method

> Only works with external gateways

```
window.SDKCheckout.addPaymentContentText({ id: '{{gateway_id}}', value: 'lorem ipsum dolor sit amet' })
```

### Hide installments from the user's picklist

> Only works with transparent credit or debit card gateways

```
window.SDKCheckout.hideInstallments({ id: '{{gateway_id}}', value: [3, 6] })
```

> To reset customizations, just call the method one more time with empty string or empty array