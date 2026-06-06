---
title: Product Variant
source: https://tiendanube.github.io/api-documentation/resources/product-variant
version: 2025-03
---

# Product Variant

Product variants allow you to group a shoe with different sizes and colors in the same product. You can only create products with up to 1000 variants.

## Properties

| Property | Explanation 
| id | The unique numeric identifier for the Product Variant 
| image_id | The id of the product's image associated with the variant 
| product_id | The id of the product associated with the variant 
| price | Price of the Product Variant. *null* indicates the product will initiate a contact instead of a checkout process 
| promotional_price | Lower price to display as a sale. The value of price will be displayed crossed out for comparison 
| stock_management | Specifies whether or not Tiendanube/Nuvemshop tracks the number of items in stock for this product variant. Valid values are *true* if Tiendanube/Nuvemshop tracks the stock, *false* if it doesn't. 
| stock | Stock of the Product Variant. If `stock_management` is false the stock will be null 
| weight | Weight of the Product Variant in kilograms 
| width | Width of the Product Variant in centimetres 
| height | Height of the Product Variant in centimetres 
| depth | Depth of the Product Variant in centimetres 
| sku | Unique identifier of the Product Variant in your store 
| values | List of the values of the attributes whose values define the variant. E.g.: Large, Medium, etc. It is important that the number of `values` is equal to the number of `attributes` within the products. 
| barcode | The value associated with an identifier of the product (GTIN, EAN, ISBN, etc.) 
| mpn | The Manufacturer Part Number (MPN) of the product 
| age_group | Attribute to set the demographic that the product is designed for. It is optional and only supports this values: "newborn", "infant", "toddler", "kids" and "adult". 
| gender | Attribute to specify the gender your product is designed for. It is optional and only supports the values: "female", "male" and "unisex" 
| cost | Cost of getting or producing the product. It is optional and, if present, has to be a number bigger than 0. 
| created_at | Date when the Product Variant was created in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 
| updated_at | Date when the Product Variant was last updated in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 

## Endpoints

### GET /products/{product_id}/variants

Receive a list of all Product Variants for a given product.

| Parameter | Explanation 
| since_id | Restrict results to after the specified ID 
| created_at_min | Show Product Variants created after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| created_at_max | Show Product Variants created before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| updated_at_min | Show Product Variants last updated after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| updated_at_max | Show Product Variants last updated before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| page | Page to show 
| per_page | Amount of results 
| fields | Comma-separated list of fields to include in the response 

#### GET /products/1234/variants

`HTTP/1.1 200 OK`

```
[ { "id": 101, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234A", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.00", "width": null, "cost": null }, { "id": 112, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Medium" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234B", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.25", "width": null, "cost": null }, { "id": 133, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234C", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.50", "width": null, "cost": "10.99" }]
```

#### GET /product/1234/variants?since_id=105

`HTTP/1.1 200 OK`

```
[ { "id": 112, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234B", "mpn": "00638HAY", "age_group": "adult", "gender": "unisex", "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.25", "width": null, "cost": null }, { "id": 133, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234C", "mpn": "00638ANG", "age_group": "adult", "gender": "unisex", "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.50", "width": null, "cost": "10.99" }]
```

### GET /products/{product_id}/variants/{id}

Receive a single Product Variant

| Parameter | Explanation 
| fields | Comma-separated list of fields to include in the response 

#### GET /products/1234/variants/112

`HTTP/1.1 200 OK`

```
{ "id": 112, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Small" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234B", "mpn": "LO2302GIU", "age_group": "adult", "gender": "female", "updated_at": "2013-03-11T09:14:11-03:00", "weight": "2.25", "width": null, "cost": "10.99"}
```

### POST /products/{product_id}/variants

Create a new Product Variant

#### POST /products/1234/variants

```
{ "values": [ { "en": "X-Large" } ], "price": "19.00"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Variants cannot be repeated"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Product is not allowed to have more than 1000 variants"}
```

```
{ "code": 422, "message": "Unprocessable Entity", "description": "The selected age group is invalid"}
```

```
{ "code": 422, "message": "Unprocessable Entity", "description": "The selected gender is invalid"}
```

`HTTP/1.1 201 Created`

```
{ "id": 144, "image_id": null, "promotional_price": null, "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "19.00", "product_id": 1234, "stock_management": false, "stock": null, "sku": null, "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": null, "width": null, "cost": null}
```

### PUT /products/{product_id}/variants/{id}

Modify an existing Product Variant

#### PUT /products/1234/variants/144

```
{ "id": 144, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234D", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": "2.75", "width": null, "cost": "10.99"}
```

`HTTP/1.1 200 OK`

```
{ "id": 144, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 5, "sku": "BSG1234D", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T12:15:11-03:00", "weight": "2.75", "width": null, "cost": "10.99"}
```

### PUT /products/{product_id}/variants

Updates the entire `ProductVariant` collection owned by a specific `Product`. Use this endpoint to add, modify or remove `ProductVariant`s in one single batch operation.

If the operation is successful, all the variants sent in the request will be the current and only variants for the `Product`.

Each `ProductVariant` will be identified by its value combination. If a specified value combination doesn't exist, a new `ProductVariant` will be created, otherwise, the `ProductVariant` matching that value combination will be updated. Value combinations that aren't present in the request body, identify `ProductVariant`s that will be deleted.

#### PUT /products/1234/variants

```
[ { "values": [ { "es": "Large" } ], "stock": 4, "price": 10.5 }, { "values": [ { "es": "Medium" } ] }]
```

`HTTP/1.1 200 OK`

Indicates that the entire collection has been processed successfully. Returns the current `ProductVariant`s collection of the `Product`.

```
[ { "id": 33739371, "image_id": null, "product_id": 17310851, "position": 27, "price": "10.50", "promotional_price": null, "stock_management": true, "stock": 4, "weight": "0.000", "width": "0.00", "height": "0.00", "depth": "0.00", "sku": null, "mpn": null, "age_group": null, "gender": null, "values": [ { "es": "Large" } ], "barcode": null, "cost": null, "created_at": "2021-11-10T20:40:44+0000", "updated_at": "2021-11-10T20:40:44+0000" }, { "id": 33739372, "image_id": null, "product_id": 17310851, "position": 28, "price": null, "promotional_price": null, "stock_management": false, "stock": null, "weight": "0.000", "width": "0.00", "height": "0.00", "depth": "0.00", "sku": null, "mpn": null, "age_group": null, "gender": null, "values": [ { "es": "Medium" } ], "barcode": null, "cost": null, "created_at": "2021-11-10T20:40:44+0000", "updated_at": "2021-11-10T20:40:44+0000" }]
```

`HTTP/1.1 400 Bad Request`

```
{ "code": 400, "message": "Bad Request", "description": "Invalid input format"}
```

```
{ "code": 400, "message": "Bad Request", "description": "Variant values should not be empty"}
```

```
{ "code": 400, "message": "Bad Request", "description": "There must be at least one variant"}
```

```
{ "code": 400, "message": "Bad Request", "description": "Invalid values format"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Validation error", "price": ["The price must be at least 0."], "stock": ["The stock must be an integer."]}
```

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Variant values should not be repeated"}
```

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Product is not allowed to have more than 1000 variants."}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "The selected age group is invalid"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "The selected gender is invalid"}
```

`HTTP/1.1 500 Internal Server Error`

```
{ "code": 500, "message": "Internal Server Error", "description": null}
```

### PATCH /products/{product_id}/variants

Partially update a `ProductVariant` collection. This endpoint allows to modify many existing `ProductVariant`s that belong to the given `Product`.

This endpoint *will not* add new `ProductVariant`s or remove existing `ProductVariant`s; it will just update their values.

#### Preconditions

Request body is an array of `ProductVariant` resources.

Each `ProductVariant` in the request body must:

- include the `ProductVariant` ID, set in the field `id`

- correspond to an existing `ProductVariant` with same ID than the one set in the field `id`

- belong to the `Product` which ID is set in `\{product_id\}` in the URL

- have a unique combination of `values` among all `ProductVariant`s of the `Product` (either `ProductVariant`s included in the request or previously persisted).

If any of the above preconditions is not met, the response:

- has HTTP status code `422`

- contains a JSON with error information including the IDs of the failed `ProductVariant`s:

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Variants cannot be repeated", "duplicate_variant_ids": [33745216, 33745217, 33745218]}
```

#### HTTP status code

`200`: All `ProductVariant`s in the request have been updated. Complete updated `ProductVariant` collection is returned.
`404`: `Product` with ID `\{product_id\}` was not found.
`422`: Changes are not processable because some of the above preconditions has not been met.

#### PATCH /products/1234/variants

```
[ { "id": 143, "values": [ { "en": "Large" } ], "price": "19.00" }, { "id": 144, "values": [ { "en": "X-Large" } ], "price": "21.00" }]
```

`HTTP/1.1 200 OK`

```
[ { "id": 143, "image_id": null, "promotional_price": null, "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Large" } ], "price": "19.00", "product_id": 1234, "stock_management": false, "stock": null, "sku": null, "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": null, "width": null, "cost": null }, { "id": 144, "image_id": null, "promotional_price": null, "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "21.00", "product_id": 1234, "stock_management": false, "stock": null, "sku": null, "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": null, "width": null, "cost": null }]
```

### DELETE /products/{product_id}/variants/{id}

Remove a Product Variant

#### DELETE /products/1234/variants/112

`HTTP/1.1 200 OK`

```
{}
```

### POST /products/{product_id}/variants/stock

Update the stock for one or all variants of a product by adding, removing or replacing.

The request body must be an object containing:

| Field | Description | Required 
| `action` | Dictates the type of update and must be one of the following values: `"replace"` to replace the current stock with a new one or `"variation"` to add or remove the given quantity | Yes 
| `value` | For `"variation"`, a positive quantity adds to the current stock and a negative one removes from it. For `"replace"`, it indicates the new stock to set: a positive quantity, `0` (stockout) or `null` (infinite stock) | Yes 
| `id` | If present, only the product variant with this ID will be updated. Otherwise, all variants for this product will be affected by the update | No 

On success, a collection of all `Product Variant`s that were updated is returned.

> Note that removing more stock than available will not result in an error but rather a stock of 0.

#### POST /products/1234/variants/stock

```
{ "action" : "replace", "value" : 10,}
```

`HTTP/1.1 200 OK`

```
[ { "id": 143, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "Large" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 10, "sku": "BSG1234DL", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": "2.75", "width": null, "cost": "10.99" }, { "id": 144, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 10, "sku": "BSG1234DX", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": "2.75", "width": null, "cost": "10.99" }]
```

#### POST /products/1234/variants/stock

```
{ "action" : "variation", "value" : -2, "id" : 144}
```

`HTTP/1.1 200 OK`

```
[ { "id": 144, "image_id": null, "promotional_price": "19.00", "created_at": "2013-01-03T09:11:51-03:00", "depth": null, "height": null, "values": [ { "en": "X-Large" } ], "price": "25.00", "product_id": 1234, "stock_management": true, "stock": 8, "sku": "BSG1234DX", "mpn": null, "age_group": null, "gender": null, "updated_at": "2013-06-01T09:15:11-03:00", "weight": "2.75", "width": null, "cost": "10.99" }]
```

On failure, a response with error information is returned.

`HTTP/1.1 404 Not Found`

```
{ "code": 404, "message": "Not Found", "description": "Product with such id does not exist"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Valid actions are 'replace', 'variation'."}
```

`HTTP/1.1 500 Internal Server Error`

```
{ "code": 500, "message": "Internal Server Error", "description": null}
```

## Extra shipping days by Product Variant

For products that have extra days that must be considered in the shipment (manufacturing, preparation), you can use our Metafields API.
When creating the metafield with the number of additional days, the key **must be** sent as **additional_days**, otherwise the days will not be considered. Payload example:

`POST /metafields`

```
{ "key":"additional_days", "value":"5", "namespace":"shipping_rules", "owner_id":2856879, "owner_resource":"Product_Variant", }
```

In this payload, the only things that should vary are:

- **Value**: It is the total number of additional days that the product will have.

- **Owner_id**: Product variant identifier.

## Rate Limiting for Variant Updates

To ensure high performance and stability across the platform, we have implemented a **Weighted Token Bucket** rate limiter for endpoints involved in updating product variants.

Unlike standard rate limiters that strictly count the number of HTTP requests per second, this limiter calculates the consumption of tokens based on the **weight of the payload**. This ensures that the rate limit correlates directly with the impact on our systems.

### How it works

Each request "pays" a cost in tokens depending on the complexity of the data sent. The following factors increase the payload weight and, consequently, the token consumption:

- **Quantity of variants:** More variants in a single request require more tokens.

- **Translations:** Including translations for variant properties increases the weight.

- **Inventory data:** Updating stock levels for multiple variants adds to the cost.

**For example**

This request is heaviest than the second one.

```
[ { "id": 143, "values": [ { "en": "Large" } ], "price": "19.00", "visible": false }, { "id": 144, "values": [ { "en": "X-Large" } ], "price": "21.00" }, { "id": 145, "values": [ { "en": "Medium" } ], "price": "30.00" }, { "id": 146, "values": [ { "en": "Small" } ], "price": "15.00", "inventory_levels": [ { "stock": 30, "location_id": "AH132YHD38NJUH39" } ] }]
```

Second payload

```
[ { "id": 143, "values": [ { "en": "Large", "es": "Large" } ], "price": "19.00", "visible": true }, { "id": 144, "values": [ { "en": "X-Large", "es": "X-Large" } ], "price": "21.00", "visible": true }]
```

### Handling Rate Limits

If your request exceeds the available tokens in the bucket, the API will respond with a `429 Too Many Requests` status code.

**Recommendation:**
If you frequently encounter `429` errors during bulk updates, we recommend splitting your operations into smaller batches (sending fewer variants per request). This reduces the payload weight, requiring fewer tokens and helping you stay within the allowed limits.

## FAQ

How to set up unlimited/infinite stock?

In order to set unlimited stock for a product or variant, you have to modify the variant's stock to `""`. Example:

```
{ "stock": ""}
```

Note: The `stock_management` property is automatically set by Tiendanube, and can't be modified via API. This property can have the following values:

- false: the variant's stock is infinite.

- true: the variant's stock is equal or higher than 0.

Why is the stock_management property not being modified?

This property is automatically set by Tiendanube, and can't be modified via API. It can have the following values:

- false: when the variant's stock is infinite.

- true: when the variant's stock is equal or higher than 0.

In order to set unlimited stock for a product or variant, you have to modify the variant's stock to `""`. Example:

```
{ "stock": ""}
```