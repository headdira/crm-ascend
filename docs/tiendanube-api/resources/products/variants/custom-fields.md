---
title: Product Variant Custom Fields
source: https://tiendanube.github.io/api-documentation/resources/products/variants/custom-fields
version: 2025-03
---

# Product Variant Custom Fields

A custom field allows the store owner/merchant to expand their experience and control their own business through personalized and unique custom fields for product variants.

## Properties

| Property | Explanation | Type | Required 
| id | The unique universal identifier for the custom field | UUID | false 
| name | Name of the custom field | String | true 
| description | Description of the custom field | String | false 
| value_type | Custom field type (text_list, text, numeric, date) | Enum | true 
| owner_resource | Custom field owner (`product_variant`) | String | true 
| read_only | If set to true, it restricts the association of the custom field by merchants via the administrator panel, the merchant can only read the value associated with the custom field. (default value is `false`) | Boolean | false 
| values | A list of all values for a custom field (for value_type text_list only, for other types can be an empty array) | Array | true 

## Endpoints

### POST /products/variants/custom-fields

Create a new custom field

#### POST /products/variants/custom-fields

```
{ "name": "Production status", "description": "Possible product production status", "value_type": "text_list", "read_only": false, "values": ["Started", "In Production", "Finished"]}
```

`HTTP/1.1 201 CREATED`

```
{ "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "name": "Production status", "description": "Possible product production status", "value_type": "text_list", "read_only": false, "owner_resource": "product_variant", "values": [ { "value": "Started", "created": true }, { "value": "In Production", "created": true }, { "value": "Finished", "created": true } ]}
```

`HTTP/1.1 201 CREATED - When some value returns error`

```
{ "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "name": "Production status", "description": "Possible product production status", "value_type": "text_list", "read_only": false, "owner_resource": "product_variant", "values": [ { "value": "Started", "created": true }, { "value": "In Production", "created": true }, { "value": "Finished", "created": false, "error": "The custom field value with key is duplicated" } ]}
```

### GET /products/variants/custom-fields

Return a list of all custom fields from a specific owner resource

#### GET /products/variants/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "0df04fdf-db03-47d0-8c2e-8735e7a55df5", "name": "Maker", "description": "Product maker", "value_type": "text", "read_only": false, "owner_resource": "product_variant", "values": [] }, { "id": "0e271b50-bf27-433c-84cc-57d88f283e73", "name": "Age group", "description": "Age group for the product", "value_type": "numeric", "read_only": false, "owner_resource": "product_variant", "values": [] }]
```

### PUT /products/variants/custom-fields/{id}

Update the custom field values

#### PUT /products/variants/custom-fields/{id}

```
{ "values": ["Waiting for supplier"]}
```

`HTTP/1.1 200 OK`

```
{ "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "name": "Production status", "description": "Possible product production status", "value_type": "text_list", "read_only": false, "owner_resource": "product_variant", "values": [ { "value": "Started", "created": true }, { "value": "In Production", "created": true }, { "value": "Finished", "created": true }, { "value": "Waiting for supplier", "created": true } ]}
```

### GET /products/variants/{id}/custom-fields

List custom fields associated with a specific product variant

#### GET /products/variants/{id}/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "name": "Production status", "owner_resource": "product_variant", "value_type": "text_list", "source": "app", "description": "Possible product production status", "read_only": false, "value": "Started" }]
```

### GET /products/variants/custom-fields/{id}/owners

List product variants associated with a specific custom field

#### GET /products/variants/custom-fields/{id}/owners

`HTTP/1.1 200 OK`

```
{ "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "name": "Production status", "description": "Possible product production status", "value_type": "text_list", "read_only": false, "owner_resource": "product_variant", "values": [ { "value": "Started", "created": true }, { "value": "In Production", "created": true }, { "value": "Finished", "created": true }, { "value": "Waiting for supplier", "created": true } ], "product-variants": [ { "id": 123456, "value": "Started" } ]}
```

### PUT /products/variants/{id}/custom-fields/values

Update a value associated with a product variant.

#### PUT /products/variants/{id}/custom-fields/values

```
[ { "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "value": "Finished" }]
```

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### DELETE /products/variants/custom-fields/{id}

Delete a custom field

#### DELETE /products/variants/custom-fields/d6079ed1-6aaf-4392-8c10-32557e7f93f3

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### GET /products/variants/custom-fields/{id}

List the data of a given product variant custom field

#### GET /products/variants/custom-fields/{id}

`HTTP/1.1 200 OK`

```
{ "id": "f18ded4b-77b3-4360-ae32-07810993613f", "name": "Color", "owner_resource": "product_variant", "value_type": "text_list", "source": "admin", "description": "Color types", "read_only": false, "created_at": "2023-03-10T21:42:14+0000", "updated_at": "2023-03-10T21:42:14+0000", "values": [ "Yellow", "Blue", "White", "Orange", "Black", "Pink", "Green", "Red" ]}
```

## FAQ

How to associate or disassociate a custom-field with a specific product variant?

In this case, the endpoint PUT products/variants/{variant_id}/custom-fields/values ([link with documentation](/api-documentation/resources/products/variants/custom-fields#put-productsvariantsidcustom-fieldsvalues)) should be used, which overwrites the custom-fields associated with that product variant.

If you would like to create new custom-field associations, the following body should be sent:

```
[ { "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "value": "In Production" }, { "id": "f18ded4b-77b3-4360-ae32-07810993613f", "value": "Yellow" }]
```

If you would like to remove a single custom-field association, the following body should be sent:

```
[ { "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "value": null }]
```

On the other hand, if a custom-field have two associations and you would like to remove all of them, the following body should be sent:

```
[ { "id": "d6079ed1-6aaf-4392-8c10-32557e7f93f3", "value": null }, { "id": "f18ded4b-77b3-4360-ae32-07810993613f", "value": null }]
```

Important: the custom-field must already be created for the entity.

It's possible to delete all custom-fields with the DELETE endpoint?

Only those created by own App. Custom-fields created by another App or by the merchant can't be deleted.

Can this type of custom field be used as a filter in the store?

Yes, the filter must be configured by the merchant from the store admin (Filters section).