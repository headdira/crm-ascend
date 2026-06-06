---
title: How to go from variant.stock to variant.inventory_levels
source: https://tiendanube.github.io/api-documentation/guides/multi-inventory/products
version: 2025-03
---

# How to go from variant.stock to variant.inventory_levels

To start working with stock by location in variants, the main change is that now the variant contains the `inventory_levels` element and the stock attribute is deprecated.
The stock is defined in each location that is inside the `inventory_levels` object.

In APIs that include `variant.stock` we'll also add `variant.inventory_levels`:

- `GET /products/\{id\}`

- `GET /products/\{id\}/variants`

This change also affects all endpoints where stock can be updated:

- `POST /products/\{id\}/variants`

- `PUT /products/\{id\}/variants/\{id\}`

- `PATCH /products/\{id\}/variants`

- `POST /products/\{id\}/variants/stock`

- `PATCH /products/stock-price`

We are going to explain the change for each endpoints:

## GET /products/{id} - GET /products/{id}/variants

```
{ "id": 112, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5,+ "inventory_levels": [+ {+		 "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N",+			 "stock": 5+		 }+ ], "sku": "BSG1234B", "mpn": "LO2302GIU", "age_group": "adult", "gender": "female", "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.25", "width": null, "cost": "10.99" }
```

Once multi inventory is activated, `variant.stock` will reflect the total stock for that variant in every location.

## POST /products/{id}/variants - PUT /products/{id}/variants/{id}

As you can see below the stock field is defined at the location level within `inventory_levels`.

```
{ "values":[ { "es": "Talle L" } ],- "stock": 5,+ {+ inventory_levels: [+ {+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N",+ "stock": 5+ }+ ]+ } }
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

This request will imply that the stock will be set to 5 for location with id `01GQ2ZHK064BQRHGDB7CCV0Y6N`.

If stock is sent for a location and also in the variant, this last attribute will not generate any change.

```
{ "values":[ { "es": "Talle L" } ], {- "stock": 5,+ inventory_levels: [+ {+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N",+ "stock": 5+ }+ ] }}
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

In this example the variant will have stock 5.

In this first stage, since there will only be one location, the `inventory_levels` can be sent without specifying a `location_id` and the stock will be assigned to the first location for that variant.

```
{ "values":[ { "es": "Talle L" } ], {- "stock": 5,+ inventory_levels: [+ {+ "stock": 5+ }+ ] }}
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

In this case, the stock will be assigned to 5 to the first location of that variant.

In case of sending a location but not sending stock and sending it at a variant level, a **422** will be returned.

```
{ "values":[ { "es": "Talle L" } ], {- "stock": 5,+ inventory_levels: [+ {+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N"+ }+ ] }}
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

For now, a **422** is also returned if more than one location is sent for a variant.

```
{ "name":{ "es": "nombre de producto" } "variants":[ {+ inventory_levels: [+ {+ "stock": 5+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N"+ },+ {+ "stock": 5+ "location_id": "01GQ2ZHK064BQRHGDB7DDCS4SA"+ }+ ], } ]}
```

> **Important:** Once multi level inventory is enabled (ETA March 2023) we'll accept multiple inventory levels per variant.

## PATCH /products/{id}/variants

Like the others endpoints, the stock field is defined at the location level within inventory_levels.

```
[ { "values":[ { "es": "Talle L" } ],+ "inventory_levels: [+ {+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N",+ "stock": 99+ }+ ] }, { "values":[ { "es": "Talle S" } ],- "stock": 99 }]
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

In this case, the stock would be updated to 99 of the "Talle L" variant at location `01GQ2ZHK064BQRHGDB7CCV0Y6N` and to 5 for the "Talle S" variant at the first location.

In the event that an inventory level is specified but the stock field is not sent for a location, a **422** will be returned.

```
[ { "values":[ { "es": "Talle L" } ],+ "inventory_levels: [+ {+ "location_id": "123e4567-e89b-12d3-a456-426614174765"+ }+ ] }, { "values":[ { "es": "Talle S" } ],- "stock": 5 }]
```

> **NOTE:** `variant.stock` attribute is deprecated but, in order to maintain backward compatibility we are going to keep supporting it. If only `variant.stock` is sent, we'll update the first `inventory_level` for that variant.

When a location_id that does not exist is sent, a **422** will be returned.

## POST /products/{id}/variants/stock

As in the rest of the previous endpoints, if a location is not sent, the first location will be used.

```
{ "action" : "replace", "value" : 10,}
```

If a location is sent, the stock for the specific location will be modified:

```
{ "action" : "variation", "value" : +5,+ "location_id" : "01GQ2ZHK064BQRHGDB7CCV0Y6N", "id" : 144}
```

In this case, the location `01GQ2ZHK064BQRHGDB7CCV0Y6N` will have a stock of 5 assuming that it did not previously have a stock value specified.

When a location_id that does not exist is sent, a **422** will be returned.

## PATCH /products/stock-price

This endpoint already support sending the inventory level, now it allows to specify the `location_id`.

If no `location_id` is sent to it, like the rest of the endpoints, the first location will be used.

If the `location_id` is sent to it it will modify the stock for the specific `location_id`.

```
[ { "id": 49819000, "variants": [ { "id": 133862417, "price": 222.03 }, { "id": 133862416, "inventory_levels": [ {+ "location_id": "01GQ2ZHK064BQRHGDB7CCV0Y6N", "stock": 100 } ] } ] }]
```

In this case, the stock will be 100 for the variant `133862416` at location_id `01GQ2ZHK064BQRHGDB7CCV0Y6`N.

If given the `location_id` that does not exist, a **422** will be returned.