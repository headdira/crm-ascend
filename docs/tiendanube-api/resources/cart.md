---
title: Cart
source: https://tiendanube.github.io/api-documentation/resources/cart
version: 2025-03
---

# Cart

The Cart resource allows the manipulation of shopping carts generated in a storefront.

Only a Cart that is **still modifiable** can be accesed. Carts that have been converted or are
still in the conversion process to an Order are no longer accessible via the Cart resource.
Also, a Cart that has initiated a Redirect checkout process is no longer accessible.

You need the corresponding `read_orders` or `write_orders` scopes in order to call these endpoints.

## Endpoints

### GET /carts/{id}

Receive a single Cart by its id.

If you would like to retrieve an Order instead, refer to the [Order resource](/api-documentation/resources/order).

### DELETE /carts/{id}/line-items/{id}

Remove a line item from a Cart by its line item id.

#### DELETE /carts/1234/line-items/5678

`HTTP/1.1 200 OK`

```
{}
```

### DELETE /carts/{id}/coupons/{id}

Unset a Coupon from a Cart by its coupon id.

#### DELETE /carts/1234/coupons/5678

`HTTP/1.1 200 OK`

```
{}
```