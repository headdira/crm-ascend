---
title: Coupons
source: https://tiendanube.github.io/api-documentation/resources/coupon
version: 2025-03
---

# Coupons

A discount coupon is a promotional tool that allows a store to offer savings to its customers. There are three types of coupons available:

- **Percentage:** Applies a discount based on a percentage of the cart total.

- **Absolute Value:** Reduces the cart total by a specific, fixed amount.

- **Free Shipping:** Eliminates the shipping cost without affecting the value of the products in the cart.

## Properties

| Property | Explanation 
| id | The unique numeric identifier for the coupon. 
| code | String that identifies the coupon. 
| type | Type of the coupon. Can take the following values: percentage, absolute or shipping. 
| valid | Indicates if the coupon is valid (`true`) or not (`false`). 
| start_date | Date from which the coupon is valid. 
| end_date | Date of overdue of the coupon. 
| deleted_at | Date when the coupon was deleted. The value is NULL if the coupon is still valid. 
| max_uses | Max number of times the coupon can be used. 
| value | Value of the discount. 
| includes_shipping | Indicates if the coupon also applies to shipping costs (`true`) or not (`false`). 
| first_consumer_purchase | Indicates if the coupon applies only to the first purchase of a consumer based on the email and/or personal ID. 
| min_price | Indicates the minimum value of the bill for applying the discount. 
| categories | List of [Category](/api-documentation/resources/category) objects representing the categories of the store to which the discount applies. 
| products | List of [Product](/api-documentation/resources/product) objects representing the products of the store to which the discount applies. 
| combines_with_other_discounts | Indicates if the coupon is combinable with other promotions or discounts. 
| only_cheapest_shipping | Indicates if the coupon only applies to the cheapest eligible shipping option. Effective only for `type = shipping` coupons; ignored otherwise. 

## Endpoints

### GET /coupons

Retrieve the list of all coupons.

#### Filtering Properties

| Parameter | Explanation 
| q | The coupon's code to filter. 
| min_start_date | The minimum start_date to filter. 
| min_end_date | The minimum end_date to filter. 
| max_start_date | The maximum start_date to filter. 
| max_end_date | The maximum end_date to filter. 
| valid | Flag (true of false) for filtering valid coupons. 
| status | Coupon's status for filtering coupons. One of: `activated`, `deactivated`. 
| limitation_type | Coupon's limitation for filtering coupons. One of: `quantity`, `cart_value`, `categories`. 
| term_type | Coupon's term limitation for filtering coupons. One of: `unlimited`, `limited`. 
| discount_type | Coupon's discount type for filtering coupons. One of: `percentage`, `absolute`, `shipping`. 
| includes_shipping | Coupon that apply to shipping costs for filtering coupons. 
| sort_by | Attribute for ordering coupons. One of: `created-at-ascending`, `created-at-descending`, `alpha-ascending`, `alpha-descending`, `uses-ascending`, `uses-descending`. 
| created_at_min | Show Products created after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)). 
| created_at_max | Show Products created before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)). 
| updated_at_min | Show Products last updated after date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)). 
| updated_at_max | Show Products last updated before date ([ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)). 
| page | Page to show. 
| per_page | Amount of results. 
| fields | Comma-separated list of fields to include in the response. 

#### GET /coupons

`HTTP/1.1 200 OK`

Response

E.g.

```
[ { "id": 32965, "code": "PR2", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": true, "only_cheapest_shipping": false, "categories": [ { "id": 117023, "name": { "es": "Oxido N\u00edtrico (NO2)", "en": "Oxido N\u00edtrico (NO2)" }, "parent": 0 } ] }, { "id": 32966, "code": "PR23", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": false, "only_cheapest_shipping": false, "categories": null }, { "id": 32964, "code": "PR4", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-06-07", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": true, "only_cheapest_shipping": false, "products": [ { "id": 173107, "name": { "es": "Remera manga corta", "en": "Short sleeve T-shirt" } }, { "id": 173108, "name": { "es": "Remera manga larga", "en": "Long sleeve T-shirt" } } ] }, { "id": 32963, "code": "PR5", "type": "percentage", "value": "30.00", "valid": false, "used": 0, "max_uses": null, "includes_shipping": false, "start_date": null, "end_date": null, "min_price": 100, "first_consumer_purchase": false, "combines_with_other_discounts": true, "only_cheapest_shipping": false, "categories": [ { "id": 105190, "name": { "es": "Pantalones", "en": "Pantalones" }, "parent": 0 }, { "id": 105191, "name": { "es": "Camisas", "en": "Camisas" }, "parent": 0 }, { "id": 117023, "name": { "es": "Oxido N\u00edtrico (NO2)", "en": "Oxido N\u00edtrico (NO2)" }, "parent": 0 } ] }]
```

#### GET /coupons?valid=true

`HTTP/1.1 200 OK`

Response

E.g.

```
[ { "id": 32965, "code": "PR2", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": false, "only_cheapest_shipping": false, "categories": [ { "id": 117023, "name": { "es": "Oxido N\u00edtrico (NO2)", "en": "Oxido N\u00edtrico (NO2)" }, "parent": 0 } ] }, { "id": 32966, "code": "PR23", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": true, "only_cheapest_shipping": false, "categories": null }, { "id": 32964, "code": "PR4", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-06-07", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": false, "only_cheapest_shipping": false, "categories": [ { "id": 117023, "name": { "es": "Oxido N\u00edtrico (NO2)", "en": "Oxido N\u00edtrico (NO2)" }, "parent": 0 } ] }]
```

### GET /coupons/{id}

Retrieve a single coupon.

#### GET /coupons/32964

`HTTP/1.1 200 OK`

Response

E.g.

```
{ "id": 32964, "code": "PR4", "type": "percentage", "value": "30.00", "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-06-07", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": false, "combines_with_other_discounts": true, "only_cheapest_shipping": false, "categories": [ { "id": 117023, "name": { "es": "Oxido N\u00edtrico (NO2)", "en": "Oxido N\u00edtrico (NO2)" }, "parent": 0 } ]}
```

### POST /coupons

Create a new coupon.

#### Properties

| Parameter | Explanation | Required 
| code | Must be unique and can contain only alphanumeric characters. | True 
| type | One of: `percentage`, `absolute`, `shipping`. | True 
| value | The value is mandatory if the type is percentage or absolute. | False 
| start_date | Must be a datetime. | False 
| end_date | Must be a datetime. | False 
| categories | A List of Category IDs. Cannot be combined with `products`. | False 
| products | A List of Product IDs. Cannot be combined with `categories`. | False 
| min_price | Must be a numeric value with greater than or equal to zero. | False 
| valid | Must be a boolean. | False 
| includes_shipping | Must be a boolean. | False 
| first_consumer_purchase | Must be a boolean. | False 
| combines_with_other_discounts | Must be a boolean. Defaults to `true`. | False 
| only_cheapest_shipping | Must be a boolean. Defaults to `false`. | False 
Payload

E.g.

```
{ "code": "PRUEBA", "type": "percentage", "value": "30.00", "max_uses": 100, "includes_shipping": false, "min_price": 10, "first_consumer_purchase": true, "categories": null, "start_date": "2014-05-08", "end_date": "2014-06-08", "combines_with_other_discounts": true, "only_cheapest_shipping": false}
```

`HTTP/1.1 201 Created`

Response

E.g.

```
{ "id": 32967, "code": "PRUEBA", "type": "percentage", "value": "30.00", "valid": true, "used": null, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": true, "categories": null, "combines_with_other_discounts": true, "only_cheapest_shipping": false}
```

### PUT /coupons/{id}

Modify an existing coupon.

#### PUT /coupons/32967

Payload

E.g.

```
{ "code": "OTRAPRUEBA", "type": "absolute", "value": 50}
```

`HTTP/1.1 200 OK`

Response

E.g.

```
{ "id": 32967, "code": "OTRAPRUEBA", "type": "absolute", "value": 50, "valid": true, "used": 0, "max_uses": 100, "includes_shipping": false, "start_date": "2014-05-08", "end_date": "2014-06-08", "min_price": 10, "first_consumer_purchase": true, "categories": null, "combines_with_other_discounts": false, "only_cheapest_shipping": false}
```

### DELETE /coupons/{id}

Delete an existing coupon.

#### DELETE /coupons/32967

`HTTP/1.1 200 OK`

```
{}
```