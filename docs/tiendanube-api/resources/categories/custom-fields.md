---
title: Category Custom Fields
source: https://tiendanube.github.io/api-documentation/resources/categories/custom-fields
version: 2025-03
---

# Category Custom Fields

A custom field allows the store owner/merchant to expand their experience and control their own business through personalized and unique custom fields for categories.

## Properties

| Property | Explanation | Type | Required 
| id | The unique universal identifier for the custom field | UUID | false 
| name | Name of the custom field | String | true 
| description | Description of the custom field | String | false 
| value_type | Custom field type (text_list, text, numeric, date) | Enum | true 
| owner_resource | Custom field owner (`category`) | String | true 
| read_only | If set to true, it restricts the association of the custom field by merchants via the administrator panel, the merchant can only read the value associated with the custom field. (default value is `false`) | Boolean | false 
| values | A list of all values for a custom field (for value_type text_list only, for other types can be an empty array) | Array | true 

## Endpoints

### POST /categories/custom-fields

Create a new custom field

#### POST /categories/custom-fields

```
{ "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "values": ["Cotton", "Linen"]}
```

`HTTP/1.1 201 CREATED`

```
{ "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "owner_resource": "category", "values": [ { "value": "Cotton", "created": true }, { "value": "Linen", "created": true } ]}
```

`HTTP/1.1 201 CREATED - When some value returns error`

```
{ "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "owner_resource": "category", "values": [ { "value": "Cotton", "created": true }, { "value": "Linen", "created": false, "error": "The custom field value with key is duplicated" } ]}
```

### GET /categories/custom-fields

Return a list of all categories custom fields

#### GET /categories/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "owner_resource": "category", "values": ["Cotton", "Linen"] }, { "id": "e3cd25ae-0b6e-4a37-9c53-86f06ee604b8", "name": "General observations", "description": "", "value_type": "text", "read_only": false, "owner_resource": "category", "values": [] }]
```

### PUT /categories/custom-fields/{id}

Update the custom field values

#### PUT /categories/custom-fields/e0a56bef-91d0-45f7-a70d-6b9264c85e8c

```
{ "values": ["Silk"]}
```

`HTTP/1.1 200 OK`

```
{ "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "owner_resource": "category", "values": [ { "value": "Cotton", "created": true }, { "value": "Linen", "created": true }, { "value": "Silk", "created": true } ]}
```

### PUT /categories/{id}/custom-fields/values

Update a value associated with a category.

#### PUT /categories/1234567/custom-fields/values

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "value": "Cotton" }]
```

`HTTP/1.1 204 NO CONTENT`

```
{}
```

### GET /categories/{id}/custom-fields

List custom fields associated with a specific category

#### GET /categories/1234567/custom-fields

`HTTP/1.1 200 OK`

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "owner_resource": "category", "value_type": "text_list", "source": "app", "description": "Material type of this category products", "read_only": false, "value": "Cotton" }]
```

### GET /categories/custom-fields/{id}/owners

List categories associated with a specific custom field

#### GET /categories/custom-fields/e0a56bef-91d0-45f7-a70d-6b9264c85e8c/owners

`HTTP/1.1 200 OK`

```
{ "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "description": "Material type of this category products", "value_type": "text_list", "read_only": false, "owner_resource": "category", "values": [ { "value": "Cotton", "created": true }, { "value": "Linen", "created": true }, { "value": "Silk", "created": true } ], "categories": [ { "id": 1234567, "value": "Cotton" } ]}
```

### GET /categories/custom-fields/{id}

List the data of a given category custom field

#### GET /categories/custom-fields/e0a56bef-91d0-45f7-a70d-6b9264c85e8c

`HTTP/1.1 200 OK`

```
{ "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "name": "Material type", "owner_resource": "category", "value_type": "text_list", "source": "app", "description": "Material type of this category products", "read_only": false, "created_at": "2023-10-10T18:03:14+0000", "updated_at": "2023-10-10T18:03:14+0000", "values": [ "Cotton", "Linen", "Silk" ]}
```

### DELETE /categories/custom-fields/{id}

Delete a custom field

#### DELETE /categories/custom-fields/e0a56bef-91d0-45f7-a70d-6b9264c85e8c

`HTTP/1.1 204 NO CONTENT`

```
{}
```

## FAQ

How to associate or disassociate a custom-field with a specific category?

In this case, the endpoint PUT categories/{category_id}/custom-fields/values ([link with documentation](/api-documentation/resources/categories/custom-fields#put-categoriesidcustom-fieldsvalues)) should be used, which allows to create or remove custom-field associations.

If you would like to create new custom-field associations, the following body should be sent:

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "value": "Cotton" }, { "id": "e3cd25ae-0b6e-4a37-9c53-86f06ee604b8", "value": "Great material" }]
```

If you would like to remove a single custom-field association, the following body should be sent:

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "value": null }]
```

On the other hand, if a custom-field have two associations and you would like to remove all of them, the following body should be sent:

```
[ { "id": "e0a56bef-91d0-45f7-a70d-6b9264c85e8c", "value": null }, { "id": "e3cd25ae-0b6e-4a37-9c53-86f06ee604b8", "value": null }]
```

Important: the custom-field must already be created for the entity.

It's possible to delete all custom-fields with the DELETE endpoint?

Only those created by own App. Custom-fields created by another App or by the merchant can't be deleted.