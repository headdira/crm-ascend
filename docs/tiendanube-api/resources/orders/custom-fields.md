---
title: Order Custom Fields
source: https://tiendanube.github.io/api-documentation/resources/orders/custom-fields
version: 2025-03
---

# Order Custom Fields

A custom field allows the store owner/merchant to expand their experience and control their own business through personalized and unique custom fields for orders.

## Properties

| Property | Explanation | Type | Required 
| id | The unique universal identifier for the custom field | UUID | false 
| name | Name of the custom field | String | true 
| description | Description of the custom field | String | false 
| value_type | Custom field type (text_list, text, numeric, date) | Enum | true 
| owner_resource | Custom field owner (`order`) | String | true 
| read_only | If set to true, it restricts the association of the custom field by merchants via the administrator panel, the merchant can only read the value associated with the custom field. (default value is `false`) | Boolean | false 
| values | A list of all values for a custom field (for value_type text_list only, for other types can be an empty array) | Array | true 

## Endpoints

### POST /orders/custom-fields

Create a new custom field

#### POST /orders/custom-fields

```
{ "name": "Delivery status", "description": "Possible delivery status", "value_type": "text_list", "read_only": false, "values": ["Started", "In transit", "Finished"]}
```

`HTTP/1.1 201 CREATED`

```
{ "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "owner_resource": "order", "name": "Delivery status", "description": "Possible delivery status", "read_only": false, "values": [ { "value": "Started", "created": true }, { "value": "In transit", "created": true }, { "value": "Finished", "created": true } ]}
```

`HTTP/1.1 201 CREATED - When some value returns error`

```
{ "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "owner_resource": "order", "name": "Delivery status", "description": "Possible delivery status", "read_only": false, "values": [ { "value": "Started", "created": true }, { "value": "In transit", "created": true }, { "value": "Finalizada", "created": false, "error": "The custom field value with key is duplicated" } ]}
```

### GET /orders/custom-fields

Return a list of all custom fields from a specific owner resource

#### GET /orders/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "0df04fdf-db03-47d0-8c2e-8735e7a55df5", "name": "Notes", "owner_resource": "order", "value_type": "text", "description": "Invoice notes", "read_only": false, "values": [] }, { "id": "0e271b50-bf27-433c-84cc-57d88f283e73", "name": "Delivery date", "owner_resource": "order", "value_type": "date", "description": "Product delivery date", "read_only": false, "values": [] }]
```

### PUT /orders/custom-fields/{id}

Update the custom field values

#### PUT /orders/custom-fields/{id}

```
{ "values": ["Canceled"]}
```

`HTTP/1.1 200 OK`

```
{ "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "owner_resource": "order", "name": "Delivery status", "description": "Possible delivery status", "read_only": false, "values": [ { "value": "Started", "created": true }, { "value": "In transit", "created": true }, { "value": "Finished", "created": true }, { "value": "Canceled", "created": true } ]}
```

### GET /orders/{id}/custom-fields

List custom fields associated with a specific order

#### GET /orders/{id}/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "name": "Delivery status", "owner_resource": "order", "value_type": "text_list", "source": "app", "description": "Possible delivery status", "read_only": false, "value": "Started" }]
```

### GET /orders/custom-fields/{id}/owners

List orders associated with a specific custom field

#### GET /orders/custom-fields/{id}/owners

`HTTP/1.1 200 OK`

```
{ "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "owner_resource": "order", "name": "Delivery status", "description": "Possible delivery status", "read_only": false, "values": [ { "value": "Started", "created": true }, { "value": "In transit", "created": true }, { "value": "Finished", "created": true }, { "value": "Canceled", "created": true } ], "orders": [ { "id": 123456, "value": "Started" } ]}
```

### PUT /orders/{id}/custom-fields/values

Update a value associated with a order on order details.

#### PUT /orders/{id}/custom-fields/values

```
[ { "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "value": "In transit" }]
```

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### DELETE /orders/custom-fields/{id}

Delete a custom field

#### DELETE /orders/custom-fields/9dda74d1-5dc9-43bd-90e2-4dce3b5f3835

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### GET /orders/custom-fields/{id}

List the data of a given order custom field

#### GET /orders/custom-fields/{id}

`HTTP/1.1 200 OK`

```
{ "id": "40685075-a317-4fa0-87ae-a5946723ce5a", "name": "Status", "owner_resource": "order", "value_type": "text_list", "source": "admin", "description": "Types of order status", "read_only": false, "created_at": "2023-04-03T18:06:54+0000", "updated_at": "2023-04-03T18:06:54+0000", "values": [ "Finished", "In Progess", "Pending" ]}
```

## FAQ

How to associate or disassociate a custom-field with a specific order?

In this case, the endpoint PUT orders/{order_id}/custom-fields/values ([link with documentation](/api-documentation/resources/orders/custom-fields#put-ordersidcustom-fieldsvalues)) should be used, which overwrites the custom-fields associated with that order.

If you would like to create new custom-field associations, the following body should be sent:

```
[ { "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "value": "Started" }, { "id": "0e271b50-bf27-433c-84cc-57d88f283e73", "value": "2024-01-01" }]
```

If you would like to remove a single custom-field association, the following body should be sent:

```
[ { "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "value": null }]
```

On the other hand, if a custom-field have two associations and you would like to remove all of them, the following body should be sent:

```
[ { "id": "9dda74d1-5dc9-43bd-90e2-4dce3b5f3835", "value": null }, { "id": "0e271b50-bf27-433c-84cc-57d88f283e73", "value": null }]
```

Important: the custom-field must already be created for the entity.

It's possible to delete all custom-fields with the DELETE endpoint?

Only those created by own App. Custom-fields created by another App or by the merchant can't be deleted.