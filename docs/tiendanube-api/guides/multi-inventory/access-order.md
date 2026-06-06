---
title: How to access the new information of the Order
source: https://tiendanube.github.io/api-documentation/guides/multi-inventory/access-order
version: 2025-03
---

# How to access the new information of the Order

For a further understanding of this guide we recommend reading [Order](/api-documentation/resources/order) and [Managing multiple fulfillments](/api-documentation/guides/multi-inventory).

Your application needs to adjust how it displays information about the order if:

- It uses at least one of the following scopes:

`read_orders`

- It receives any of these webhooks:

`order/created`

- `order/updated`

- `order/paid`

- `order/packed`

- `order/fulfilled`

- `order/cancelled`

## Changes in Order API

Despite backwards compatibility, shipping information at order level is DEPRECATED, and the recommendation is to use the new [Fulfillment Order](/api-documentation/resources/fulfillment-order) object that contains all shipping information.

We are adding a new property `fulfillments`. By default only the Fulfillment Order IDs are returned.

```
{ "id": 871254203, ...- "shipping_min_days": null,- "shipping_max_days": null, ...- "shipping_cost_owner": "0.00",- "shipping_cost_customer": "0.00", "coupon": [], "promotional_discount": {..}, "subtotal": "6000.00", "discount": "600.00", "discount_coupon": "0.00", "discount_gateway": "600.00", "total": "5400.00", "total_usd": "40.79", "checkout_enabled": true, "weight": "0.000", "currency": "ARS", "language": "es", "gateway": "offline", "gateway_id": null, "gateway_name": "Transferencia Bancaria",- "shipping": "table",- "shipping_option": "Envio Personalizado 1",- "shipping_option_code": "table_6103303",- "shipping_option_reference": null,- "shipping_pickup_details": null,- "shipping_tracking_number": null,- "shipping_tracking_url": null,- "shipping_store_branch_name": null,- "shipping_pickup_type": "ship",- "shipping_suboption": [], "extra": {}, "storefront": "store", "note": "", "created_at": "2022-11-15T19:36:59+0000", "updated_at": "2022-11-15T19:37:08+0000", "completed_at": {...}, "next_action": "waiting_manual_confirmation", "payment_details": {...}, "attributes": [], "customer": {...}, "products": [...], "number": 306, "cancel_reason": null, "owner_note": null, "cancelled_at": null, "closed_at": null, "read_at": null, "status": "open", "payment_status": "pending", "gateway_link": null,- "shipping_carrier_name": null,- "shipping_address": {...},- "shipping_status": "unpacked",- "shipped_at": null, "paid_at": null, "landing_url": "http://www.example.com?source=abc", "client_details": {...}, "app_id": null,+ "fulfillments": ["01BX5ZZKBKACTAV9WEVGEMMVRZ", "01BX5ZZKBKZZZZZZZZZZZZZZZX"]}
```

**NOTE:** Properties marked with (-) will continue existing, but they are deprecated. We will continue to maintain the shipping information in the Order level, but with the values corresponding to the first Fulfillment of the Order.

- `order.shipping` → will return the value of `fulfillment.shipping.carrier_id` of the Fulfillment of the Order.

- `order.shipping_*` → will return the corresponding value according to the table of the Fulfillment of the Order.

- `order.shipped_at` → will return the date the Fulfillment of the Order was shipped.

> ⚠️ **Warning**
While Order Fulfillments are created when the Order is completed, if there's any error during this process the Order will be completed anyway and the fulfillments will be processed later.
Depending on the error's cause this might take a while, so at one point the return value of the `fulfillments` property might be an empty array.
This case should be handled by the application accordingly (most likely by retrying this request until the fulfillments are returned)

```
{ "id": 871254203, "token": "b872a1befbcde5aaf0517ecbcc910f5dc005350e", "store_id": "817495", // ... All fields from GET /orders are included in the response+ "fulfillments": []}
```

### Get the full shipping information

You will need to adjust how your app displays information about the order in order to show full information associated with shipments.

Even though Fulfillment API can be used to access all details, to simplify adaptation when making a GET request to `/orders/\{id\}` we offer the parameter `aggregates=fulfillment_orders` to include the complete fulfillment object details in the response, so as to continue receiving all information in one request.

[GET /orders/{id}?aggregates=fulfillment_orders](/api-documentation/resources/order#get-ordersaggregatesfulfillment_orders)

**Then you will need to access the desired shipping information from the `fulfillments` property.**
In this [table](/api-documentation/guides/multi-inventory#managing-multiple-fulfillments) we show exactly how each field that was formerly in Orders is mapped to its respective value in each Fulfillment Order.

### Example: GET /orders/{id}?aggregates=fulfillment_orders

```
{ "id": 871254203, ...- "shipping_min_days": null,- "shipping_max_days": null, ...- "shipping_cost_owner": "0.00",- "shipping_cost_customer": "0.00", "coupon": [], "promotional_discount": {..}, "subtotal": "6000.00", "discount": "600.00", "discount_coupon": "0.00", "discount_gateway": "600.00", "total": "5400.00", "total_usd": "40.79", "checkout_enabled": true, "weight": "0.000", "currency": "ARS", "language": "es", "gateway": "offline", "gateway_id": null, "gateway_name": "Transferencia Bancaria",- "shipping": "table",- "shipping_option": "Envio Personalizado 1",- "shipping_option_code": "table_6103303",- "shipping_option_reference": null,- "shipping_pickup_details": null,- "shipping_tracking_number": null,- "shipping_tracking_url": null,- "shipping_store_branch_name": null,- "shipping_pickup_type": "ship",- "shipping_suboption": [], "extra": {}, "storefront": "store", "note": "", "created_at": "2022-11-15T19:36:59+0000", "updated_at": "2022-11-15T19:37:08+0000", "completed_at": {...}, "next_action": "waiting_manual_confirmation", "payment_details": {...}, "attributes": [], "customer": {...}, "products": [...], "number": 306, "cancel_reason": null, "owner_note": null, "cancelled_at": null, "closed_at": null, "read_at": null, "status": "open", "payment_status": "pending", "gateway_link": null,- "shipping_carrier_name": null,- "shipping_address": {...},- "shipping_status": "unpacked",- "shipped_at": null, "paid_at": null, "landing_url": "http://www.example.com?source=abc", "client_details": {...}, "app_id": null,+ "fulfillments":[{+ "id":"01BX5ZZKBKACTAV9WEVGEMMVRZ",+ "number":"123456",+ "total_quantity":12,+ "total_weight":12.12,+ "total_price": {...},+ "assigned_location": {+ "id":"123e4567-e89b-12d3-a456-426614174000",+ "name":"Location name",+ "address":{+ "zipcode":"12910802",+ "street":"Some Street",+ "number":"100",+ "floor":"Some Floor",+ "locality":"Some Locality",+ "city":"Some City",+ "reference":"Some Reference",+ "between_streets":"Some Between Streets",+ "province":{+ "code":"SP",+ "name":"São Paulo"+ },+ "region":{+ "code":"SE",+ "name":"Sudeste"+ },+ "country":{+ "code":"BR",+ "name":"Brasil"+ }+ }+ },+ "line_items": [...],+ "recipient": {...},+ "shipping": {+ "type":"pickup|ship",+ "carrier":{+ "name":"Some Carrier Name",+ "id":"12345"+ },+ "option":{+ "name":"Some Option Name",+ "code":"some-option-code",+ "reference":"some-option-ref"+ },+ "merchant_cost":{+ "value":123.14,+ "currency":"BRL"+ },+ "consumer_cost":{+ "value":123.14,+ "currency":"BRL"+ },+ "min_delivery_date":"2022-11-24T10:20:19+00:00""|| null",+ "max_delivery_date":"2022-11-25T10:20:19+00:00""|| null",+ "pickup_details":{+ "id":"pickup-option-id",+ "name":"Some option pickup detail name",+ "address":999+ }+ },+ "destination":{+ "zipcode":"12910802",+ "street":"Some Street",+ "number":"100",+ "floor":"Some Floor",+ "locality":"Some Locality",+ "city":"Some City",+ "reference":"Some Reference",+ "between_streets":"Some Between Streets",+ "province":{+ "name":"São Paulo",+ "code":"SP"+ },+ "region":{+ "name":"Sudeste",+ "code":"SE"+ },+ "country":{+ "name":"Brasil",+ "code":"BR"+ }+ },+ "status":"PENDING",+ "tracking_info": {...}+ "fulfilled_at":null,+ "created_at":"2022-11-24T10:20:19+00:00",+ "updated_at":"2022-11-24T10:20:19+00:00"+ }]}
```