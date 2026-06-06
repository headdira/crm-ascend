---
title: Getting Started with Nuvemshop API
source: https://tiendanube.github.io/api-documentation/intro
version: 2025-03
---

# Getting Started with Nuvemshop API

This is a REST-style API that uses JSON for serialization and OAuth 2 for authentication and follows this [versioning](/api-documentation/versioning) model.

## Where do I start?

Want to get started with API integration? Here's a quick check list:

- Register as a partner in [Tiendanube](http://www.tiendanube.com/partners) or [Nuvemshop](http://www.nuvemshop.com.br/parceiros).

- Once inside your partner's admin panel, go to the "Apps" section and create your app.

- Read up on [how to authenticate](#authentication) your app with us.

- Read the API docs to understand what you can do with your app.

## Making a request

All URLs start with `https://api.tiendanube.com/2025-03/{store_id}` or `https://api.nuvemshop.com.br/2025-03/{store_id}`. **SSL only**.

The path is prefixed with the store id and the API version. If we change the API in backward-incompatible ways, we'll bump the version marker and maintain stable support for the old URLs. To underst

So if you want to access the store with id `123456` via the API the url will either:

- `https://api.tiendanube.com/2025-03/123456`

or

- `https://api.nuvemshop.com.br/2025-03/123456`.

To make a request for all the store's products you would do the following in curl:

```
curl -H 'Authentication: bearer ACCESS_TOKEN' \ -H 'User-Agent: MyApp (name@email.com)' \ https://api.tiendanube.com/2025-03/123456/products
```

where `ACCESS_TOKEN` is the store's access token for your app (see Authentication).

To create something, you have to include the `Content-Type` header and the JSON data:

```
curl -H 'Authentication: bearer ACCESS_TOKEN' \ -H 'Content-Type: application/json' \ -H 'User-Agent: MyApp (name@email.com)' \ -d '{ "name": "My new product" }' \ https://api.tiendanube.com/2025-03/123456/products
```

## Authentication

We follow the OAuth 2 framework for letting users authorize your application to use Tiendanube/Nuvemshop on their behalf. Quite briefly, when a user installs it you can obtain an access token (a secret string denoting your rights over his store), which you have to include in the header of every request (as shown in the above example).

Read the [authentication guide](/api-documentation/authentication) to get started.

## Identify your app

In every API request, you must include a `User-Agent` header with the name of your application and a link to it or your email address so we can get in touch with you. Here's a couple of examples:

User-Agent: Super app ([http://superapp.com/contact](http://superapp.com/contact))
or
User-Agent: Awesome app ([awesome@app.com](mailto:awesome@app.com))

If you don't supply this header, you will get a `400 Bad Request` response.

## Just JSON

All data is sent and received as JSON. Our format is to have no root element and we use snake_case to describe attribute keys. This means that you have to send `Content-Type: application/json; charset=utf-8` when POSTing or PUTing data into Tiendanube/Nuvemshop.

You'll receive a `415 Unsupported Media Type` response code if you leave out the `Content-Type` header.

## Client errors

These are the possible types of client errors on API calls that receive request bodies:

- Sending invalid JSON will result in a `400 Bad Request` response.

```
HTTP/1.1 400 Bad RequestContent-Length: 34{"error": "Problems parsing JSON"}
```

- Sending invalid fields will result in a `422 Unprocessable Entity` response.

```
HTTP/1.1 422 Unprocessable EntityContent-Length: 47{ "src": [ "can't be blank" ]}
```

## Server errors

If Tiendanube/Nuvemshop is having trouble, you might see a 5xx error. `500` means that the app is entirely down, but you might also see `502 Bad Gateway`, `503 Service Unavailable`, or `504 Gateway Timeout`. It's your responsibility in all of these cases to retry your request later.

## Rate limiting

In order to control the incoming traffic from the API, you can perform a limited number of requests in a given period of time. Currently, the approach used to limit the API usage is based on a [Leaky Bucket algorithm](https://en.wikipedia.org/wiki/Leaky_bucket) implementation, where the default bucket size is of 40 requests with a leaky rate of 2 requests per second, which means that you can perform up to 2 requests per second, with bursts of 40 requests, without getting a [429 Too Many Requests](http://tools.ietf.org/html/draft-nottingham-http-new-status-02#section-4) error. We use the following headers to provide information about the limit usage:

- `x-rate-limit-limit` : Total requests that can be done in a given period, in the case, the bucket size.

- `x-rate-limit-remaining` : Remaining requests to completely fill the bucket.

- `x-rate-limit-reset` : Remaining milliseconds to completely empty the bucket.

> Important: The rate limit works between each store and app.

> If the store is Next or Evolution (higher plans), the rate limit multiplies by 10.

Examples:

- `Queue 20 requests at a time`: they will not be processed at the same time. They will be processed according to the Rate Limit: 2 requests/sec. All 20 requests would take 10 seconds to process.

- `Sends 4 requests/sec`:. every second 4 new requests arrive and 2 leave. So every second there are 2 requests queued. After 20 seconds, we will have 40 requests queued (bucket max). In the next second, two will be processed normally, however the other 2 will be lost (as they will receive an error from our API - status 429).

- `Queues 50 requests at a time`: since the bucket only supports 40 queued requests, 10 will be lost (as they will receive an error from our API: status 429). The other 40 will be processed according to the Rate Limit: 2 requests/sec.

## Pagination

Requests that return multiple items will not be paginated by default. You must specify further pages with the `page` parameter. You can also set a custom page size up to 200 with the `per_page` parameter.

```
curl -H 'Authentication: bearer ACCESS_TOKEN ' \ -H 'User-Agent: MyApp (name@email.com)' \ 'https://api.tiendanube.com/2025-03/123456/products?page=2&per_page=100'
```

Note that page numbering is 1-based and that ommiting the `page` parameter will return the first page.

To check the total count of the results you can use the `x-total-count` header:

```
x-total-count: 156
```

To check the next and previous links for pagination you can use the `Link` header:

```
Link: ; rel="next", ; rel="last"
```

The possible `rel` values are:

- `next` : Shows the URL of the immediate next page of results.

- `last` : Shows the URL of the last page of results.

- `first` : Shows the URL of the first page of results.

- `prev` : Shows the URL of the immediate previous page of results.

You **should** use the `Link` URLs instead of building your own.

## HTTP Verbs

Where possible, API `2025-03` strives to use appropriate HTTP verbs for each action.

- `HEAD` : Can be issued against any resource to get just the HTTP header info.

- `GET` : Used for retrieving resources.

- `POST` : Used for creating resources.

- `PUT` : Used for replacing resources or collections. For PUT requests with no body attribute, be sure to set the Content-Length header to zero.

- `DELETE` : Used for deleting resources.

## Languages and Internationalization

Stores can potentially have multiple languages. This means that some properties of the Product and Category endpoints will be objects detailing the value for each language.

For example,

```
curl -H 'Authentication: bearer ACCESS_TOKEN ' \ -H 'User-Agent: MyApp (name@email.com)' \ -D - \ https://api.tiendanube.com/2025-03/123456/categories/1234
```

```
HTTP/1.1 200 OKDate: Thu, 05 Sep 2013 18:18:22 GMTContent-Type: application/json; charset=UTF-8Content-Length: 376x-main-language: es
```

```
{ "id": 1234, "name": { "es": "Nombre de la Categoría", "pt": "Nome da Categoria" }, "description": { "es": "", "pt": "" }, "handle": { "es": "nombre-de-la-categoria", "pt": "nome-da-categoria" }, "parent": null, "subcategories": [ ], "created_at": "2013-09-05T17:59:19+0000", "updated_at": "2013-09-05T17:59:19+0000"}
```

The properties affected by internationalization will always be an object, even if there is only one language active. If you only care about the main language, you can obtain its code by reading the `X-Main-Language` header.

When POSTing or PUTing data you can provide an object with a value for each language:

```
curl -H 'Authentication: bearer ACCESS_TOKEN ' \ -H 'Content-Type: application/json' \ -H 'User-Agent: MyApp (name@email.com)' \ -d '{ "name": {"es": "Ejemplo", "pt": "Exemplo"} }' \ https://api.tiendanube.com/2025-03/123456/products
```

Or you can simply provide a string value, which will be applied to all languages:

```
curl -H 'Authentication: bearer ACCESS_TOKEN ' \ -H 'Content-Type: application/json' \ -H 'User-Agent: MyApp (name@email.com)' \ -d '{ "name": "Example" }' \ https://api.tiendanube.com/2025-03/123456/products
```

## Front-end integration

When using [scripts](/api-documentation/resources/script) to integrate your app with the storefront, you may want to bind yourself to certain events or access related objects.

While support for this is still being improved, there is one single event you may bind yourself to: `LS.registerOnChangeVariant(callback)` where `callback` is a function that receives a single argument, a `variant`, that contains information about the chosen product variant. In particular, `variant.element` contains a string detailing a jQuery selector that you may use in order to obtain a container for the chosen variant's form; this is important when working with themes that have a "quick shop" feature, such as LinkedMan or LinkedWoman, as there may be more than one product form present in a page.

## Suspension of API access due to lack of payment

Being a monthly subscription service, it's possible that a store will not renew its service. In this case, the store will go offline and the API will be inaccessible. The API will also be inaccessible if the app has a recurring price and it's not paid in time.

In either case, all API calls will return a `402 Payment Required` response, [Scripts](/api-documentation/resources/script) will not be included and [Webhooks](/api-documentation/resources/webhook) will not be called. Please make sure you handle this error code to notify the user that he needs to resume his payment instead of displaying a generic server error.

Once the required payment is made, the API becomes accessible again.

If your app needs to know when access to the API is suspended or resumed (because you may have missed a webhook and want to do a full resync, for example), you can register to the `app/suspended` and `app/resumed` events using a Webhook.

Note: these webhooks aren't triggered when the app runs out of "free days". In these cases the API will also be inaccessible, but no webhooks will be triggered.

## API resources

- [Abandoned Checkout](/api-documentation/resources/abandoned-checkout)

- [Category](/api-documentation/resources/category)

- [Category Custom Fields](/api-documentation/resources/categories/custom-fields)

- [Coupons](/api-documentation/resources/coupon)

- [Customer](/api-documentation/resources/customer)

- [Customer Custom Field](/api-documentation/resources/customers/custom-fields)

- [Discounts](/api-documentation/resources/discounts)

- [Draft Order](/api-documentation/resources/draft-order)

- [Location](/api-documentation/resources/location)

- [Metafields](/api-documentation/resources/metafields)

- [Order](/api-documentation/resources/order)

- [Order Custom Fields](/api-documentation/resources/orders/custom-fields)

- [Payment Provider](/api-documentation/resources/payment-provider)

- [Product](/api-documentation/resources/product)

- [Product Custom Fields](/api-documentation/resources/products/custom-fields)

- [Product Image](/api-documentation/resources/product-image)

- [Product Variant](/api-documentation/resources/product-variant)

- [Product Variant Custom Fields](/api-documentation/resources/products/variants/custom-fields)

- [Script](/api-documentation/resources/script)

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

- [Store](/api-documentation/resources/store)

- [Transaction](/api-documentation/resources/transaction)

- [Webhook](/api-documentation/resources/webhook)

## Help us make it better

Please tell us how we can make the API better. If you have a specific feature request or if you found a bug, please use GitHub issues. Feel free to fork these docs and send a pull request with improvements.

To talk with us about the API, feel free to write.

- `` for BR.

- `` for AR,MX and others.