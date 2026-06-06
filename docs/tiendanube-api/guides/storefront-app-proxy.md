---
title: Embedding Content Into Storefronts Using App Proxies
source: https://tiendanube.github.io/api-documentation/guides/storefront-app-proxy
version: 2025-03
---

# Embedding Content Into Storefronts Using App Proxies

## What is an App Proxy?

An App Proxy is a mechanism by which an app can respond to a url within the context of a storefront.

For example, `https://www.example.com/apps/my-app/some-path/hello-world` would be routed to your app's servers so you can process the request and provide a response that can be embedded into the storefront's layout or dispalyed as html, json, etc as is.

## Handling a proxied request

An App Proxy has two parameters:

**Prefix**: If your prefix is `my-app`, all urls starting with `/apps/my-app` will be proxied to you. It must be unique among all apps.
**Base url**: This is where we'll forward the requests to. For example, `https://my-app.com/proxy`.

When a request is proxied, its path after the prefix is appended to the base url to build the destination url.

Query paramters and POST/PUT body from the original request are included in the proxied request, along with a series of http headers to provide more information regarding the storefront:

**X-Store-Id**: The id of the store that received the request.
**X-Customer-Id**: The if of the logged in customer. Empty if no customer is logged in.
**X-Language-Code**: Language code for the storefront. Format is `es_AR`, `pt_BR`, etc.
**X-Country-Code**: Country code for the storefront. Format is `AR`, `BR`, `MX`, etc.
**X-Forwarded-For**: IP of the user visiting the storefront.
**X-Request-Id**: Unique identifier for this request.

Other headers from the original request are not passed through, with the exception of `Content-Type`. In particular, cookies are not included in the proxied request.

### Verifying a proxied request

Similarly to [webhooks](/api-documentation/resources/webhook#verifying-a-webhook), proxied requests include a signature so that you can validate its origin and integrity.

To verify a proxied request you need to compute a HMAC digest using SHA-256 and verify that it matches the one provided in the `X-Linkedstore-HMAC-SHA256` header.

The string you need to hash is the concatenation of the headers `X-Store-Id`, `X-Customer-Id` and `X-Request-Id` in that order without any separator, and the key to the signature is your app's client secret.

Here's an example of this validation in php:

```

### Examples

For these examples, we'll consider a proxy with the following config:

**Prefix**: my-app
**Base url**: `https://my-app.com/proxy`

#### GET request

Original request

```
GET /apps/my-app/foo/filter?page=1&order=asc HTTP/1.1Host: www.example.com
```

Proxied request:

```
GET /proxy/foo/filter?page=1&order=asc HTTP/1.1Host: my-app.comX-Store-Id: 12345X-Customer-Id: 9876X-Language-Code: es_ARX-Country-Code: ARX-Forwarded-For: 172.18.0.1X-Request-Id: e7787124-5bb2-40ae-b014-afcba92299bfX-Linkedstore-HMAC-SHA256: 7308863cde00bb4365ef5a8f226cccb8871b57a4054aa6d3d49c5b6f78b1e306
```

#### POST request

Original request

```
POST /foo/new HTTP/1.1Host: www.example.comContent-Type: application/jsonContent-Length: 41{"name": "Alice", "job": "App developer"}
```

Proxied request:

```
GET /proxy/foo/new HTTP/1.1Host: my-app.comX-Store-Id: 12345X-Customer-Id: 9876X-Language-Code: es_ARX-Country-Code: ARX-Forwarded-For: 172.18.0.1X-Request-Id: 7eba2c1e-7c21-4c4c-a670-4d6cb75f6c98X-Linkedstore-HMAC-SHA256: 6d5ab84f3a83e3cc50b8726011a2ec335c9fbbc36a30b6df9308b80524a5900bContent-Type: application/jsonContent-Length: 41{"name": "Alice", "job": "App developer"}
```

## Embedding the response into the storefront's layout

By default the response of the proxied request will be returned without modifications, but you can also embed it into the storefront's layout.

In particular, the contents of `layout.tpl` will be rendered and `{% template_content %}` will be replaced with the response from the proxy.

In order to do this, the response must meet the following criteria:

- The http status must be 2xx

- The `Content-Type` must be `text/html`

- A custom header `X-Embed` must be included with value `true`

## Configuration

Currently there's no way to create a proxy for your app on your own.

Please contact us at [parceiros@nuvemshop.com.br](mailto:parceiros@nuvemshop.com.br) or [socios@tiendanube.com](mailto:socios@tiendanube.com) if you want to set up a proxy.