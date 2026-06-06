---
title: Discount
source: https://tiendanube.github.io/api-documentation/resources/discounts
version: 2025-03
---

# Discount

Create, manage and apply discount rules.

The Discount API is a set of tools that allows the development of a wide range of promotional rules.

Before we start working, we need to clarify some basic concepts that we will be using from now on.

# Table of Contents

- [Main Concepts](#main-concepts)

[Promotions and discounts](#promotions-and-discounts)

- [Tier](#tier)

- [How it works](#how-it-works)

- [Accountabilities](#accountabilities)

- [Where do I start?](#where-do-i-start)

- [Integration](#integration)

[Register a callback](#register-a-callback)

- [Create promotions](#create-promotions)

- [List promotions](#list-promotions)

- [Managing discounts](#managing-discounts)

[Create or Update Discount](#create-or-update-discount)

- [Remove a discount](#remove-a-discount)

[Scope: Line Item](#scope-line-item)

- [Scope: Cart](#scope-cart)

- [No action needed](#no-actions-needed)

- [Errors](#errors)

[Invalid Response](#invalid-response)

- [Invalid Command](#invalid-command)

- [Message specifications](#message-specifications)

- [Request life cycle](#request-life-cycle)

- [Cart life cycle](#cart-life-cycle)

- [Uninstalled apps](#uninstalled-apps)

- [Security](#security)

- [Upcoming changes](#upcoming-changes)

- [Frequently Asked Questions](#frequently-asked-questions)

- [Resources](#resources)

## Main Concepts

### Promotions and discounts

A promotion is a set of properties and business rules that can be applied to a user's cart. An example could be ***3x2 in black t-shirts***.

This promotion has a name or description, and at the same time, is an expression of business logic which implies that for every three products in the cart, one of these will be free, as long as belongs to a specific set of products. In this case, Black T-shirts.

Even if the promotion describes a business logic, it doesn't indicate the result of that promotion in a specific cart. In other words, we don't know how much money will be discounted.

The subtotal of that cart will be 3 x 100 BRL = 300 BRL.

The promotion makes one of these products free, which means a **discount** of 100 BRL on the subtotal. Then, the total of the cart is 200 BRL.

In a nutshell, a discount is a promotion applied to a specific cart.

**PROMOTION** : Set of properties and business rules that describes a behavior.
**DISCOUNT** : The net value that will be extracted from the cart total because a promotion was applied.

### Tier

We will call Tier to a specific group of promotions. These tiers will be executed in order and will apply depending on one of each other.

We have two tiers: Line Item and Cross Items.

**Line Item**: applies at the product level.

**Cross Items**: applies to all products.

## How it works

Each application that wants to work with promotions should interact with the Tiendanube/Nuvemshop API to create promotions and
validate their business rules based on the cart information sent to a specific endpoint on the partner's side.

**Disclaimer**: Currently, the use of multicurrency is not supported. For this reason, its use is not recommended in stores with this feature.

## Accountabilities

| Accountability | Tiendanube | APP 
| To ease the creation and storage of the promotion's business logic | | **X** 
| Verify that the promotion's rules comply | | **X** 
| Request a discount to be applied | | **X** 
| Request a discount to be removed | | **X** 
| Add a discount to a cart | **X** | 
| Show the applied discount in the cart | **X** | 

## Where do I start?

Before you start to create your app, you need to follow the points described below:

- Register as a partner in [Tiendanube](http://www.tiendanube.com/partners) or [Nuvemshop](http://www.nuvemshop.com.br/parceiros).

- Once inside your partner's admin panel, go to the "Apps" section and create your app.

- Read up on [how to authenticate](/api-documentation/authentication) your app with us.

- Read the API docs to understand what you can do with your app.

## Integration

### Register a callback

The first step to bind an app with a store is to create a callback URL. This URL will be used by Tiendanube/Nuvemshop to
send all the cart information every time the consumer makes an action on it (Ex: Adds or removes an item, changes the
quantity of an item, etc.), and the store has promotions.

### Create promotions

Each application is responsible for the creation and storage of all their business logic. Nevertheless, Tiendanube/Nuvemshop needs to identify each promotion, which should be doing it through the API.

This operation will return an ID to the combination of the promotions and the current store.

You should take into consideration that some values can't be updated after the creation. For more information about the API, please refer to [Openapi.yml](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml).

### List promotions

You can retrieve all non-deleted promotions created by your app for a given store by making a `GET` request to `/promotions`. The response includes each promotion's identifier, name, allocation type, active status, and combination settings.

### Managing discounts

Any modification on the cart state will be informed to each of the partners that have registered a promotion in the store.

Each partner should evaluate the current cart, decide if a promotion should be applied or removed, and respond with the corresponding operations.

These operations in the application responses will receive the name of “commands”. All the commands will have two main properties, the command key, and the command specification.

The command's key defines which operation will be executed, and the specification provides all the data needed to perform it.

The order of command execution is not guaranteed.

The available commands will be the following.

#### Create or Update Discount

Allows to create or update a discount in a cart.

The operation allows to:

- Add a new discount to one or many line items

- Add a new discount to the cart (cross items)

- Add new line items to an already created discount.

- Update the amount of a specific promotion

Examples:

*Line Item Discount Creation*

```
{ "commands": [{ "command": "create_or_update_discount", "specs": { "promotion_id": "c78c3a59-70a9-4d8a-a224-fdd3f925cc72", "currency": "ARS", "display_text": { "es-ar": "nombre visible de promoción" }, "line_items": [{ "line_item": "717394929", "discount_specs": { "type": "fixed", "amount": "250.00" } }] } }]}
```

*Cross Items Discount Creation*

```
{ "commands": [{ "command": "create_or_update_discount", "specs": { "promotion_id": "449039b3-3c35-4860-8fde-668428ced5f3", "currency": "ARS", "display_text": { "es-ar": "nombre visible de promoción" }, "discount_specs": { "type": "fixed", "amount": "20.00" } } }]}
```

### Remove a discount

Allows removing an applied discount to a line_item or an entire cart (cross_items) specifying the scope where the operation will affect.

##### Scope: Line Item

Allows to remove discounts applied to one or more line_items associated with a single promotion.

```
{ "commands": [{ "command": "remove_discount", "specs": { "scope": "line_item", "promotion_id": "c78c3a59-70a9-4d8a-a224-fdd3f925cc72", "line_items": [ "717394929" ] } }]}
```

##### Scope: Cart

Allows removing one or many promotions to the current cart. If the promotion is associated with many line items will be removed from each one.

```
{ "commands": [{ "command": "remove_discount", "specs": { "scope": "cart", "promotion_ids": [ "449039b3-3c35-4860-8fde-668428ced5f3" ] } }]}
```

#### No actions needed

If no actions are needed, the partner should respond with a 204 HTTP code.

#### Errors

##### Invalid Response

If the partner’s response doesn’t comply with the specifications, the service will remove ALL the applied discounts from the cart. We are doing this because, given that we don’t know the business logic, we cannot determine if a discount applies or not, and we will try to protect the merchant from money losses instead of getting a new sale.

##### Invalid Command

If just one command contains invalid specifications, we will consider the response as invalid, therefore, the system will remove ALL the applied discounts from the cart.

### Message specifications

In each cart update, we will send the following information to the callback URL.

Cart Payload

```
{ "cart_id": "397256730", "store_id": "92760", "execution_tier": "cross_items", "customer": { "id": null }, "currency": "ARS", "language": "es", "shipping": { "country": null, "city": null, "postalcode": null, "cost": "0.0" }, "package": { "weight": "0.600" }, "payment": { "credit_card_company": null, "method": null, "installments": 1 }, "products": [ { "id": 467422732, "price": "12.00", "compare_at_price": "20.00", "product_id": 17310718, "quantity": 4, "free_shipping": false, "variant_id": 33739098, "variant_values": [ "S" ], "categories": [ { "id": 11353744, "parent": null, "subcategories": [ 11353746, 11353747 ] }, { "id": 11353747, "parent": 11353744, "subcategories": [] } ], "properties": { "key": "value" } } ], "totals": { "subtotal": "30000.00", "total_discount": "10300.00", "total": "19700.00" }, "promotions": [ { "id": "231bbfe4-31bc-11ec-8d3d-0242ac130003", "line_items": [] }, { "id": "4eb6777a-31bc-11ec-8d3d-0242ac130003", "line_items": [ "467422732", "122422253" ] } ], "coupons": ["coupon-15"], "utm": [{ "utm_source": "instagram", "utm_medium": "email", "utm_campaign": "hot+sale", "utm_term": "keyword", "utm_content": "first+cta+button", "timestamp": 1693599736 }], "sold_by": "1234"}
```

### Request Life Cycle

Each flow starts with a user interaction changing the cart state. For that reason, any request related to a cart that wasn't modified will be rejected by the service.

### Cart Life Cycle

Some carts are not completed at the moment they were created and could be resumed after a while.

If the cart has applied discounts, but the promotion doesn't exist anymore, or is temporarily deactivated, **it is the responsibility of the partner to remove that promotion**, otherwise, it will still exist on the cart and will cause losses to the merchant.

### Uninstalled apps

When a promotions app is uninstalled, we will **permanently** remove all the promotions created for that store; In that case, we will stop sending cart update traffic to the partner.

Given this process takes place in the background and asynchronously, some delays could appear. To prevent any misplaced discount, if some cart is sent for a store that uninstalled the app, **a 310 status code MUST be returned**.

### Security

Tiendanube/Nuvemshop will share a list of IP addresses to be registered as a Whitelist in a WFA and each Partner is responsible to block any other connections to their applications.

## Upcoming changes

### Signed Communication

We will share a secret token with each application to sign each request made by Tiendanube/Nuvemshop on the application callback. Each partner will be responsible for validating that signature.

Once the communication is signed, the WAF will not be necessary anymore, and Tiendanube/Nuvemshop could change their IP without any restriction.

## Frequently Asked Questions

### What happens if the server does respond properly?

When Tiendanube/Nuvemshop informs the cart state, each partner should respond as it is expected. If the partner does not respond correctly or have a delay in their response, given that we can’t determine if a promotion still applies or not, the promotions registered in previous updates will be removed.

### What happens if my discount is no longer valid?

If a promotional rule was valid in the past but is no longer applicable, the discount must be removed through the API by the partner.

## Resources

- [Openapi.yml](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

## FAQ

How to remove the Callback URL?

It's not possible to remove it. If the app was uninstalled or the discounts weren't registered with the endpoint POST /promotions, the callbacks wouldn't be sent from Tiendanube / Nuvemshop to the URL.

You can only modify the URL with the endpoint PUT /discounts/callbacks. More information is in this [resource](/api-documentation/resources/discounts#resources).

What's the timeout for the Discounts API?

The timeout for the Discounts API is 800ms. This timeout is applied when we make the POST request to the Callback URL.
If we don’t receive a response within 800ms, the timeout is triggered, and the cart remains unchanged.