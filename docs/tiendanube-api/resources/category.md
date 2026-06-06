---
title: Category
source: https://tiendanube.github.io/api-documentation/resources/category
version: 2025-03
---

# Category

A Category lets the store owner group his/her products to make the store easier to browse.

## Properties

| Property | Explanation 
| id | The unique numeric identifier for the Category 
| name | List of the names of the Category, in every language supported by the store 
| description | List of the descriptions of the Category, as HTML, in every language supported by the store 
| handle | List of the url-friendly strings generated from the Category's names, in every language supported by the store 
| parent | Id of the Category's parent. *null* if it has no parent 
| visibility | Represents the visibility status of a category within the category tree. Possible values are: `visible`, `hidden`, and `soft-hidden`. The `soft-hidden` value is automatically assigned when a category inherits visibility from a hidden parent and cannot be set manually. Please see the [FAQ](/api-documentation/resources/category#faq) section for more details about visibility rules. 
| visibility_updated_at | Date when the visibility field was last updated, in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 
| subcategories | The ids of the Category's first level subcategories 
| google_shopping_category | Attributes used to categorize an item. This category is selected from the Google’s taxonomy. The full list of product categories can be found here: [ES](https://www.google.com/basepages/producttype/taxonomy.es-ES.txt) - [PT](https://www.google.com/basepages/producttype/taxonomy.pt-BR.txt) 
| created_at | Date when the Category was created in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 
| updated_at | Date when the Category was last updated in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 

## Endpoints

### GET /categories

Receive a list of all Categories.

| Parameter | Explanation 
| since_id | Restrict results to after the specified ID 
| language | Specify search language (required when serching for handle) 
| handle | Show Categories with a given URL 
| parent_id | Show Categories with a given parent category 
| created_at_min | Show Categories created after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| created_at_max | Show Categories created before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| updated_at_min | Show Categories last updated after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| updated_at_max | Show Categories last updated before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)) 
| page | Page to show 
| per_page | Amount of results 
| fields | Comma-separated list of fields to include in the response 

#### GET /categories

`HTTP/1.1 200 OK`

```
[ { "created_at": "2013-01-03T09:11:51-03:00", "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "poke-balls", "es": "poke-balls", "pt": "poke-balls" }, "id": 4567, "name": { "en": "Poké Balls", "es": "Poké Balls", "pt": "Poké Balls" }, "parent": null, "subcategories": [], "visibility": "hidden", "visibility_updated_at": "2025-03-12T10:43:45+00:00", "google_shopping_category": null, "updated_at": "2013-03-11T09:14:11-03:00" }]
```

#### GET /categories?fields=id,name,subcategories

`HTTP/1.1 200 OK`

```
[ { "id": 4567, "name": { "en": "Poké Balls", "es": "Poké Balls", "pt": "Poké Balls" }, "subcategories": [] }]
```

### GET /categories/{id}

Receive a single Category

| Parameter | Explanation 
| fields | Comma-separated list of fields to include in the response 

#### GET /categories/4567

`HTTP/1.1 200 OK`

```
{ "created_at": "2013-01-03T09:11:51-03:00", "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "poke-balls", "es": "poke-balls", "pt": "poke-balls" }, "id": 4567, "name": { "en": "Poké Balls", "es": "Poké Balls", "pt": "Poké Balls" }, "parent": null, "subcategories": [], "visibility": "visible", "visibility_updated_at": "2025-03-12T10:43:45+00:00", "google_shopping_category": null, "updated_at": "2013-03-11T09:14:11-03:00"}
```

### POST /categories

Create a new Category

#### POST /categories

```
{ "invalid_name": "foobar"}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "name": [ "can't be blank" ]}
```

`HTTP/1.1 422 Unprocessable Entity`

```
{ "code": 422, "message": "Unprocessable Entity", "description": "Store has reached maximum limit of 1000 allowed categories"}
```

#### POST /categories

```
{ "name": { "en": "Gen I", "es": "Gen I", "pt": "Gen I" }, "parent": 4567, "google_shopping_category": "Clothing & Accessories > Jewelry"}
```

`HTTP/1.1 201 Created`

```
{ "created_at": "2013-06-01T12:15:11-03:00", "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "gen-i", "es": "gen-i", "pt": "gen-i" }, "id": 5678, "name": { "en": "Gen I", "es": "Gen I", "pt": "Gen I" }, "parent": 4567, "google_shopping_category": "Clothing & Accessories > Jewelry", "subcategories": [], "visibility": "visible", "visibility_updated_at": "2025-03-12T10:43:45+00:00", "updated_at": "2013-06-01T12:15:11-03:00"}
```

#### Create a hidden category

```
{ "name": { "en": "Gen I", "es": "Gen I", "pt": "Gen I" }, "visibility": "hidden"}
```

`HTTP/1.1 201 Created`

```
{ "id": 5680, "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "gen-i", "es": "gen-i", "pt": "gen-i" }, "name": { "en": "Gen I", "es": "Gen I", "pt": "Gen I" }, "google_shopping_category": "", "subcategories": [], "visibility": "hidden", "visibility_updated_at": "2025-03-12T10:43:45+00:00", "created_at": "2013-06-01T12:15:11-03:00", "updated_at": "2025-03-12T10:43:45+00:00"}
```

### PUT /categories/{id}

Modify an existing Category

#### PUT /categories/5678

```
{ "id": 5678, "parent": null}
```

`HTTP/1.1 200 OK`

```
{ "created_at": "2013-06-01T12:15:11-03:00", "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "gen-i", "es": "gen-i", "pt": "gen-i" }, "id": 5678, "name": { "en": "Gen I", "es": "Gen I", "pt": "Gen I" }, "parent": null, "subcategories": [], "google_shopping_category": null, "updated_at": "2013-06-01T12:15:11-03:00"}
```

#### Update the category visibility

Given a category

```
{ "id": 1234, "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "clothes", "es": "clothes", "pt": "clothes" }, "name": { "en": "Clothes", "es": "Ropa", "pt": "Roupas" }, "google_shopping_category": "", "subcategories": [], "visibility": "hidden", "visibility_updated_at": "2025-03-12T10:43:45+00:00", "created_at": "2013-06-01T12:15:11-03:00", "updated_at": "2025-03-12T10:43:45+00:00"}
```

#### PUT /categories/1234

```
{ "visibility": "visible"}
```

`HTTP/1.1 200 OK`

```
{ "id": 1234, "description": { "en": "", "es": "", "pt": "" }, "handle": { "en": "clothes", "es": "clothes", "pt": "clothes" }, "name": { "en": "Clothes", "es": "Ropa", "pt": "Roupas" }, "google_shopping_category": "", "subcategories": [], "visibility": "visible", "visibility_updated_at": "2025-04-29T12:08:27+00:00", "created_at": "2013-06-01T12:15:11-03:00", "updated_at": "2025-04-29T12:08:27+00:00"}
```

### DELETE /categories/{id}

Remove a Category

#### DELETE /categories/4567

`HTTP/1.1 200 OK`

```
{}
```

## FAQ

How to add categories to a product?

Categories can be added to products through the [Product](/api-documentation/resources/product) resource. Example:

**PUT /products/5123**

```
{ "categories": [1234,4567]}
```

What is the character limit of the description property

The maximum amount is 65535 characters.

How to add a child category (subcategory) to an existing category?

A category can be assigned as a child of another category by setting the *parent* property of the child category to the ID of the parent category. This can be done:

- When creating the child category

- When updating the child category (in case it already exists)

For example, let's suppose that we have a parent category called "Men" (ID 16366393), and we want to create the "Shoes" category inside "Men". We can accomplish this with the following POST request:

**POST /categories/**

```
{ "name": { "es": "Shoes" }, "parent": 16366393}
```

With this request we are not only creating the new "Shoes" category, but also adding it as a subcateogy of "Men".

In case the "Shoes" category already exists, and we want to put it inside the "Men" category, then we can just update it's *parent* property with the following request:

**PUT /categories/{SHOES_CATEGORY_ID}**

```
{ "parent": 16366393}
```

**Note:** The *subcategories* property is read-only. Therefore, it's not possible to modify that property to assign or remove childs of a parent category. Assignations and removals should be done by setting the *parent* property of child categories as explained before.

What are the visibility rules for categories in the hierarchical tree?

- A `hidden` category cannot contain `visible` subcategories.

- A `visible` category can contain `hidden` subcategories.

- The `soft-hidden` state applies only to categories that are not explicitly marked as `hidden`, but are hidden due to inheritance—i.e., they belong to a parent or ancestor category marked as `hidden`. If a category itself is explicitly marked `hidden`, it is simply hidden, not `soft-hidden`.

Example:

```
[ { "id": 123456, "subcategories": [ 111222, 555666 ], "visibility": "visible" }, { "id": 111222, "subcategories": [], "visibility": "visible" }, { "id": 555666, "subcategories": [ 999888 ], "visibility": "hidden" }, { "id": 999888, "subcategories": [], "visibility": "soft-hidden" }]
```