---
title: Product Custom Fields
source: https://tiendanube.github.io/api-documentation/resources/products/custom-fields
version: 2025-03
---

# Product Custom Fields

A custom field allows the store owner/merchant to expand their experience and control their own business through personalized and unique custom fields for products.

## Properties

| Property | Explanation | Type | Required 
| id | The unique universal identifier for the custom field | UUID (`uuid4`) | false 
| name | Name of the custom field | String (`60`) | true 
| description | Description of the custom field | String (`150`) | false 
| value_type | Custom field type | Enum (`text_list`,`text`,`numeric`,`date`) | true 
| owner_resource | Custom field owner | Enum (`product`) | false 
| read_only | If set to true, it restricts the association of the custom field by merchants via the administrator panel, the merchant can only read the value associated with the custom field. (default value is `false`) | Boolean | false 
| values | A list of all values for a custom field (for value_type text_list only, for other types can be an empty array) | Array (`string(250)[]`) | true 

## Endpoints

### POST /products/custom-fields

Create a new custom field

#### POST /products/custom-fields

```
{ "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "values": ["Acme", "Umbrella"]}
```

`HTTP/1.1 201 CREATED`

```
{ "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "owner_resource": "product", "values": [ { "value": "Acme", "created": true }, { "value": "Umbrella", "created": true } ]}
```

`HTTP/1.1 201 CREATED - When some value returns error`

```
{ "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "owner_resource": "product", "values": [ { "value": "Acme", "created": true }, { "value": "Umbrella", "created": false, "error": "The custom field value with key is duplicated" } ]}
```

### GET /products/custom-fields

Return a list of all products custom fields

#### GET /products/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "owner_resource": "product", "values": ["Acme", "Umbrella"] }, { "id": "57ca077e-2bd2-4094-9e69-b2797909657a", "name": "Production details", "description": "", "value_type": "text", "read_only": false, "owner_resource": "product", "values": [] }]
```

### PUT /products/custom-fields/{id}

Update the custom field values

#### PUT /products/custom-fields/57358282-92e5-47cc-8c6e-9f0a4e7bf05f

```
{ "values": ["Massive Dynamic"]}
```

`HTTP/1.1 200 OK`

```
{ "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "owner_resource": "product", "values": [ { "value": "Acme", "created": true }, { "value": "Umbrella", "created": true }, { "value": "Massive Dynamic", "created": true } ]}
```

### PUT /products/{id}/custom-fields/values

Update a value associated with a product.

#### PUT /products/1234567/custom-fields/values

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "value": "Acme" }]
```

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### GET /products/{id}/custom-fields

List custom fields associated with a specific product

#### GET /products/1234567/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "owner_resource": "product", "value_type": "text_list", "source": "app", "description": "Material supplier", "read_only": false, "value": "Acme" }]
```

### GET /products/custom-fields/{id}/owners

List products associated with a specific custom field

#### GET /products/custom-fields/57358282-92e5-47cc-8c6e-9f0a4e7bf05f/owners

`HTTP/1.1 200 OK`

```
{ "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "description": "Material supplier", "value_type": "text_list", "read_only": false, "owner_resource": "product", "values": [ { "value": "Acme", "created": true }, { "value": "Umbrella", "created": true }, { "value": "Massive Dynamic", "created": true } ], "products": [ { "id": 1234567, "value": "Acme" } ]}
```

### GET /products/custom-fields/{id}

List the data of a given product custom field

#### GET /products/custom-fields/57358282-92e5-47cc-8c6e-9f0a4e7bf05f

`HTTP/1.1 200 OK`

```
{ "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "name": "Supplier", "owner_resource": "product", "value_type": "text_list", "source": "app", "description": "Material supplier", "read_only": false, "created_at": "2023-10-10T18:03:14+0000", "updated_at": "2023-10-10T18:03:14+0000", "values": [ "Acme", "Umbrella", "Massive Dynamic" ]}
```

### DELETE /products/custom-fields/{id}

Delete a custom field

#### DELETE /products/custom-fields/1d89eb36-ae81-4c74-98b1-2a7d136ae038

`HTTP/1.1 204 NO CONTENT`

```
{}
```

## FAQ

How to associate or disassociate a custom-field with a specific product?

In this case, the endpoint PUT products/{product_id}/custom-fields/values ([link with documentation](/api-documentation/resources/products/custom-fields#put-productsidcustom-fieldsvalues)) should be used, which overwrites the custom-fields associated with that product.

If you would like to create new custom-field associations, the following body should be sent:

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "value": "Umbrella" }, { "id": "57ca077e-2bd2-4094-9e69-b2797909657a", "value": "Extremely safe" }]
```

If you would like to remove a single custom-field association, the following body should be sent:

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "value": null }]
```

On the other hand, if a custom-field have two associations and you would like to remove all of them, the following body should be sent:

```
[ { "id": "57358282-92e5-47cc-8c6e-9f0a4e7bf05f", "value": null }, { "id": "57ca077e-2bd2-4094-9e69-b2797909657a", "value": null }]
```

Important: the custom-field must already be created for the entity.

It's possible to delete all custom-fields with the DELETE endpoint?

Only those created by own App. Custom-fields created by another App or by the merchant can't be deleted.

Can this type of custom field be used as a filter in the store?

No, the type of custom field that can be used as a filter is the [Product Variant Custom Fields](https://tiendanube.github.io/api-documentation/resources/products/variants/custom-fields).