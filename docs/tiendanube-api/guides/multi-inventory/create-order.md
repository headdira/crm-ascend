---
title: How to adjust the creation of an order or draft order in a multi inventory environment
source: https://tiendanube.github.io/api-documentation/guides/multi-inventory/create-order
version: 2025-03
---

# How to adjust the creation of an order or draft order in a multi inventory environment

For a further understanding of this guide we recommend reading [Order](/api-documentation/resources/order) and [Managing multiple fulfillments](/api-documentation/guides/multi-inventory).

This guide focuses on apps that create orders an order:

- It uses at least one of the following scopes:

`write_draft_orders`

- `write_orders`

- It uses at least one of these endpoints:

`POST /orders`

- `POST /draft_orders`

## Changes in Order API

During this initial multi inventory phase, order creation API will not be modified. When a new order is created the fulfillment orders will be created automatically.

The API will behave differently based on the [`inventory_behaviour`](/api-documentation/resources/order#inventory-behaviour) parameter:

- `inventory_behaviour=claim`:

We'll create the `Fulfillment Orders` (one or more) based on existing inventory and fail if it cannot be done.

- Every `Fulfillment Order` will be created using `order.shipping_*` properties.

- `inventory_behaviour=bypass`:

The order will be created with a single `Fulfillment Order` using the default location.

## Next steps

At a later stage will provide partners with the possibility to define the Fulfillment Orders created for a new Order.