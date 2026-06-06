---
title: Authentication for partner actions
source: https://tiendanube.github.io/api-documentation/guides/authentication-for-partner-actions
version: 2025-03
---

# Authentication for partner actions

## Making a request

Most of the times when you need to make a request the endpoint will use the method described [here](/api-documentation/next/intro), it requires a store_id and the access token in order to manage info for that specific client. But sometimes, you'll need to make changes that do not depend on a store, for that, there's this authentication method. For the endpoints that use this type of authentication you will this alert in the documentation

> ⚠️📝 **Note:** This endpoint uses the Partner-Action authentication method [se here](#making-a-request).

The URLs for this type of endpoints start with `https://api.tiendanube.com/{version}/apps/{app_id}` or `https://api.nuvemshop.com.br/{version}/apps/{app_id}`. **SSL only**. The path is prefixed with the app id and the API version. If we change the API in backward-incompatible ways, we'll bump the version marker and maintain stable support for the old URLs.

To make a request that creates an app plan (does not depend on a store) you would do the following `curl`:

```
curl -H 'Authentication: bearer ACCESS_TOKEN' \ -H 'Content-Type: application/json' \ -H 'User-Agent: MyApp (name@email.com)' \ -d '{ ... }' \ https://api.tiendanube.com/2025-03/apps/1234/plans
```

where `ACCESS_TOKEN` is your **client secret** your app (see Authentication).