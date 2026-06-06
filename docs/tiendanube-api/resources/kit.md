---
title: Kit
source: https://tiendanube.github.io/api-documentation/resources/kit
version: 2025-03
---

# Kit

A Kit (or product bundle) is a product that groups other products together as components. It allows merchants to sell combinations of products as a single unit.

> This is a read-only resource. Kits are managed through the store's admin panel.
Only products with a single variant can be added as components of a Kit.

## Pricing

The Kit's price is calculated by summing the list prices of all its component products. If a discount percentage is defined, it is applied over that total.

### Stock

The Kit's stock is determined by the minimum available stock across all its component products, considering the quantity each component requires. If any component cannot fulfill the required quantity or runs out of stock, the Kit's stock becomes `0`. If `kit_stock` is `null`, it means the Kit has unlimited stock (same behavior as variants with `null` stock).

For example, a Kit that requires 2 units of Product A and 1 unit of Product B:

| Component | Required | Available stock | Can build 
| Product A | 2 | 10 | 5 kits 
| Product B | 1 | 3 | 3 kits 

**Kit stock = 3** (limited by Product B).

If Product B's stock drops to `0`:

| Component | Required | Available stock | Can build 
| Product A | 2 | 10 | 5 kits 
| Product B | 1 | 0 | 0 kits 

**Kit stock = 0** (Product B cannot fulfill the required quantity).

## Properties

| Property | Explanation 
| id | The unique numeric identifier for the Kit. This is the same as the Product ID 
| name | List of the names of the Kit, in every language supported by the store 
| description | List of the descriptions of the Kit, as HTML, in every language supported by the store 
| handle | List of the url-friendly strings generated from the Kit's names, in every language supported by the store 
| sku | The Kit's SKU (Stock Keeping Unit) 
| barcode | The Kit's barcode (EAN, UPC, ISBN, etc.) 
| mpn | The Kit's Manufacturer Part Number 
| gender | Target gender for the Kit. Possible values: `male`, `female`, `unisex` or `null` 
| age_group | Target age group for the Kit. Possible values: `adult`, `kids` or `null` 
| invalid_at | Date when the Kit becomes invalid in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601), or `null` 
| brand | The Kit's brand 
| published | *true* if the Kit is published in the store. *false* otherwise 
| free_shipping | *true* if the Kit is eligible for free shipping. *false* otherwise 
| canonical_url | The canonical URL of the Kit in the store 
| video_url | String with a valid URL format. Only admits https links 
| seo_title | List of the SEO friendly titles for the Kit, in every language supported by the store. Up to 70 characters 
| seo_description | List of the SEO friendly descriptions for the Kit, in every language supported by the store. Up to 320 characters 
| images | List of [Product Image](/api-documentation/resources/product-image) objects representing the Kit's images 
| categories | List of [Category](/api-documentation/resources/category) IDs representing the Kit's categories 
| tags | String with all the Kit's tags, separated by commas 
| discount_percent | Discount percentage applied to the Kit, or `null` if no discount is defined 
| components | List of component objects representing the products included in the Kit. See [Components](#components) below 
| kit_stock | The calculated stock of the Kit based on its components' availability, or `null` 
| created_at | Date when the Kit was created in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 
| updated_at | Date when the Kit was last updated in [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601) 

### Components

Each element in the `components` array has the following properties:

- **kit config**: defined when the Kit is created.

- **product data**: read from the component product at query time.

| Property | Source | Explanation 
| product_id | kit config | The unique numeric identifier of the component [Product](/api-documentation/resources/product) 
| quantity | kit config | Quantity of this component included in the Kit 
| position | kit config | Display position of the component within the Kit (0-indexed) 
| free_shipping | product data | *true* if the component product is configured as free shipping. *false* otherwise 
| is_deleted | product data | *true* if the component product has been deleted. *false* otherwise 
| name | product data | List of the names of the component product, in every language supported by the store (includes `default` key) 
| image_url | product data | URL of the component product's main image, or `null` if it has no image 
| price | product data | The component product's price 
| promotional_price | product data | The component product's promotional price, or `null` if not on promotion 
| stock | product data | The component product's available stock, or `null` 

## Endpoints

### GET /kits/{id}

Receive a single Kit with its components.

#### GET /kits/123456789

`HTTP/1.1 200 OK`

```
{ "id": 123456789, "name": { "es": "Conjunto Otoño 2026", "pt": "Conjunto Outono 2026", "en": "Fall 2026 Bundle" }, "description": { "es": "

Conjunto de ropa para el otoño.
", "pt": "

Conjunto de roupas para o outono.
", "en": "

Fall clothing bundle.
" }, "handle": { "es": "conjunto-otono-2026", "pt": "conjunto-outono-2026", "en": "fall-2026-bundle" }, "sku": "BUNDLE-FALL-2026", "barcode": null, "mpn": null, "gender": "unisex", "age_group": "adult", "invalid_at": null, "published": true, "free_shipping": false, "canonical_url": "https://mystore.mitiendanube.com/products/fall-2026-bundle/", "video_url": null, "seo_title": { "en": "Fall 2026 Bundle - MyStore" }, "seo_description": { "en": "Fall clothing bundle with hoodie and jogger pants." }, "brand": "MyStore", "created_at": "2026-03-27T12:22:59+0000", "updated_at": "2026-04-10T08:15:30+0000", "tags": "bundle,fall,apparel,2026", "images": [ { "id": 1152273818, "product_id": 123456789, "src": "https://d2r9epyceweg5n.cloudfront.net/stores/001/234/products/fall-2026-bundle.jpg", "position": 1 } ], "categories": [ 4567 ], "discount_percent": 10, "components": [ { "product_id": 123456001, "quantity": 1, "position": 0, "free_shipping": false, "is_deleted": false, "name": { "es": "Buzo con Capucha", "pt": "Moletom com Capuz", "en": "Hoodie", "default": "Hoodie" }, "image_url": "https://d2r9epyceweg5n.cloudfront.net/stores/001/234/products/hoodie.jpg", "price": 150, "promotional_price": null, "stock": 20 }, { "product_id": 123456002, "quantity": 1, "position": 1, "free_shipping": false, "is_deleted": false, "name": { "es": "Pantalón Jogger", "pt": "Calça Jogger", "en": "Jogger Pants", "default": "Jogger Pants" }, "image_url": "https://d2r9epyceweg5n.cloudfront.net/stores/001/234/products/jogger-pants.jpg", "price": 100, "promotional_price": null, "stock": 15 } ], "kit_stock": 15}
```