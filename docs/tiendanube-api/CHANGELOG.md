---
title: CHANGELOG
source: https://tiendanube.github.io/api-documentation/CHANGELOG
version: 2025-03
---

# CHANGELOG

This changelog reflects changes in the documentation only, not in the API itself.

## 2026/05/13

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [Properties](/api-documentation/resources/fulfillment-order#properties)

DESCRIPTION:

- Added `kit` field (with `catalog_kit_id` and `order_kit_id`) to `FulfillmentOrderLineItem`, including the rule that both sub-fields must be sent together.

- Added `stock_transfer` field (with `from_location_id`) to `FulfillmentOrderLineItem`.

- Added `estimated_delivery_time` field to `FulfillmentOrderShipping`, with the nested `FulfillmentOrderEstimatedDeliveryTime`, `FulfillmentOrderEstimatedDeliveryTimeBase`, and `FulfillmentOrderAggregateDaysBase` breakdowns.

- Moved `custom_fields` above `created_at`/`updated_at` in `FulfillmentOrderLineItem`.

## 2026/05/05

RESOURCE:

- [Kit](/api-documentation/resources/kit)

SECTION:

- [Properties](/api-documentation/resources/kit#properties)

- [Components](/api-documentation/resources/kit#components)

- [GET /kits/{id}](/api-documentation/resources/kit#get-kitsid)

DESCRIPTION:

- Added Kit resource documentation with catalog detail endpoint (`GET /kits/{id}`), properties, and component structure. Moved from v1.

## 2026/04/28

RESOURCE:

- [Blog](/api-documentation/resources/blog)

SECTION:

- [GET /blogs](/api-documentation/resources/blog#get-blogs)

DESCRIPTION:

- Added `GET /blogs` endpoint to retrieve the Blog ID associated with the store.

## 2026/04/17

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [Properties](/api-documentation/resources/order#properties)

DESCRIPTION:

- Added new kit-related fields (`catalog_kit_id`, `order_kit_id`, `kit`) to the `products` array.

## 2026/04/15

RESOURCE:

- [Category](/api-documentation/resources/category)

SECTION:

- [Properties](/api-documentation/resources/category#properties)

- [FAQ](/api-documentation/resources/category#faq)

DESCRIPTION:

- Added `visibility` and `visibility_updated_at` fields to categories, along with documentation describing visibility rules within the category hierarchy.

## 2026/04/14

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

SECTION:

- [HTTP Response Handling and Fallback](/api-documentation/resources/shipping-carrier#http-response-handling-and-fallback)

- [Cache Key Composition](/api-documentation/resources/shipping-carrier#cache-key-composition)

- [Cache TTL](/api-documentation/resources/shipping-carrier#cache-ttl-time-to-live)

- [Circuit Breaker Parameters](/api-documentation/resources/shipping-carrier#circuit-breaker-parameters)

DESCRIPTION:

- Added HTTP response handling table with details on how 2xx, 4xx, 5xx, timeout and circuit breaker open states affect fallback behavior.

- Included recommendation to use 4xx for known business errors to ensure fallback shipping options are displayed.

- Documented circuit breaker parameters in a summary table.

- Added cache key composition details showing the MD5 hash structure used for server-side caching.

- Specified cache TTL expiration times for success and error responses.

## 2026/04/10

RESOURCE:

- [Abandoned checkout](/api-documentation/resources/abandoned-checkout)

SECTION:

- [Description](/api-documentation/resources/abandoned-checkout)

DESCRIPTION:

- Added description to explain abandoned carts lifespan (unobtainable after 30 days, deleted after 90 days)

## 2026/04/07

RESOURCE:

- [Discounts OpenAPI](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

SECTION:

- [GET /promotions](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

DESCRIPTION:

- Added `GET /promotions` endpoint to list all non-deleted promotions created by the current app for the current store. Returns promotion details including `id`, `name`, `allocation_type`, `active` status, and granular combination fields.

## 2026/03/31

RESOURCE:

- [Discounts](/api-documentation/resources/discounts)

SECTION:

- [Message specifications](/api-documentation/resources/discounts#message-specifications)

DESCRIPTION:

- Added `sold_by` field to the cart payload sent to partner discount applications. Contains the identifier of the seller (staff user) who initiated the sale, or `null` when no seller is assigned.

## 2026/03/30

RESOURCE:

- [Discounts OpenAPI](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

SECTION:

- [POST /promotions](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

- [PATCH /promotions/{promotion_id}](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

DESCRIPTION:

- Added granular combination fields (`combines_with_quantity_discounts`, `combines_with_free_shipping`, `combines_with_cart_amount_discounts`, `combines_with_app_discounts`, `combines_with_price_discounts`) for promotions in the Discounts OpenAPI schema.

- Marked `combines_with_other_discounts` as deprecated and documented that it must not be sent together with granular fields.

## 2026/02/24

RESOURCE:

- [Webhook](/api-documentation/resources/webhook)

SECTION:

- [Retry policies](/api-documentation/resources/webhook#retry-policies)

DESCRIPTION:

- Changed webhook retry policy timeout from 10s to 3s.

## 2026/02/23

RESOURCE:

- [Location](/api-documentation/resources/location)

- [Webhook](/api-documentation/resources/webhook)

SECTION:

- [Webhooks](/api-documentation/resources/location#webhooks) (Location)

- [Available Events](/api-documentation/resources/location#available-events)

- [Payload Structure](/api-documentation/resources/location#payload-structure)

- [Parameters](/api-documentation/resources/webhook#parameters) (Webhook)

DESCRIPTION:

- Added new Webhooks section to Location documentation.

- Documented three webhook events: `location/created`, `location/updated`, and `location/deleted`.

- Added complete payload structures with examples for each webhook event (fields: `store_id`, `event`, `id`).

- Added webhook registration instructions, required scopes (`read_locations`, `write_locations`), and important considerations.

- Updated Webhook resource events table adding `Location | created/updated/deleted`.

- Updated Webhook Parameters section with `location/created - location/updated - location/deleted` parameter block and link to Location documentation.

## 2026/02/19

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [Order](/api-documentation/resources/order#get-orders)

- [GET /orders?aggregates=custom_fields](/api-documentation/resources/order#get-ordersaggregatescustom_fields)

DESCRIPTION:

- Adds new aggregates param for `GET /orders`: `custom_fields`. Includes each Order's Custom Fields in the API response for Orders list.

## 2026/02/11

RESOURCE:

- [Webhook](/api-documentation/resources/webhook)

SECTION:

- [Parameters](/api-documentation/resources/webhook#parameters)

DESCRIPTION:

- Aligned webhook documentation with unstable: added Fulfillment Order to the events table with `status_updated`, `tracking_event_created`, `tracking_event_updated`, `tracking_event_deleted`. Added Parameters sections for `fulfillment_order/status_updated`, `fulfillment_order/tracking_event_created`, `fulfillment_order/tracking_event_updated`, `fulfillment_order/tracking_event_deleted`, and link to [Fulfillment Order documentation](/api-documentation/resources/fulfillment-order#webhooks).

## 2026/02/10

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [FulfillmentOrderLineItem](/api-documentation/resources/fulfillment-order#fulfillmentorderlineitem)

- [GET /fulfillment-orders](/api-documentation/resources/fulfillment-order#get-ordersorder_idfulfillment-orders)

- [FulfillmentOrderStatus / Workflow](/api-documentation/resources/fulfillment-order#fulfillmentorderstatus)

- [Webhooks](/api-documentation/resources/fulfillment-order#webhooks)

DESCRIPTION:

- Added new `custom_fields` property to `FulfillmentOrderLineItem` object.

- Added new `GET /fulfillment-orders` `aggregates` param with value `custom_fields`.

- Added **warning** on updating fulfillment order to `DELIVERED`: preferred approach is creating or updating tracking events with status `delivered`; when the system receives such an event (POST/PUT), it automatically sets the fulfillment order to `DELIVERED` and `fulfilled_at` to the tracking event's `happened_at`.

- **Unification (from unstable)**: Added Webhooks section with events `fulfillment_order/status_updated` and `fulfillment_order/tracking_event_created`, `fulfillment_order/tracking_event_updated`, `fulfillment_order/tracking_event_deleted` (payload: store_id, order_id, fulfillment_id, tracking_event_id, status). Label-related webhooks and label functionality are not included in this version.

## 2025/12/09

docs/resources/webhook.md
RESOURCE:

- [Webhook](/api-documentation/resources/webhook)

SECTION:

- [store/redact](/api-documentation/resources/webhook#storeredact)

DESCRIPTION:

- Removed the description that says the store/redact notification is sent in 48 hours and replaced it with "After a merchant uninstall your app, Nuvemshop|Tiendanube sends this webhook with the store ID so that you can delete the shopkeeper's information from your database."

## 2025/11/19

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [POST /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events](/api-documentation/resources/fulfillment-order#post-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-events)

DESCRIPTION:

- Added comprehensive duplicate tracking event validation rules documentation.

## 2025/11/06

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [GET /orders](/api-documentation/resources/order#get-orders)

DESCRIPTION:

- Added documentation for hard limit of 10.000 items in query results. If a query exceeds this limit, the request will return the corresponding error. Users are advised to filter their queries using available parameters, such as completion date ranges, to reduce the number of results.

## 2025/10/22

RESOURCE:

- [Scripts](/api-documentation/resources/script)

SECTION:

- [POST /scripts](/api-documentation/resources/script#post-scripts)

- [PUT /scripts/{id}](/api-documentation/resources/script#put-scriptsid)

- [DELETE /scripts/{id}](/api-documentation/resources/script#delete-scriptsid)

DESCRIPTION:

- Clarification on the scope of POST, PUT, and DELETE endpoints (only for non-autoinstallable scripts)

## 2025/10/21

RESOURCE:

- [Blog](/api-documentation/resources/blog)

DESCRIPTION:

- Added new Blog resource documentation with complete API endpoints for blog post management.

- Includes endpoints for creating, reading, updating, and deleting blog posts.

- Added publication control endpoints (publish/unpublish) for blog posts.

- Added media management endpoints for uploading images and thumbnails.

## 2025/10/20

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [GET /products](/api-documentation/resources/product#get-products)

DESCRIPTION:

- Update the explanation of how the `q` parameter works (it applies to `tags` instead of `description`).

## 2025/10/09

RESOURCE:

- [Payment Provider](/api-documentation/resources/payment-provider)

SECTION:

- [Specification](/api-documentation/resources/payment-provider#specification)

DESCRIPTION:

- Added `minimum_purchase_value` field to installments specification. This field allows defining the minimum purchase value (inclusive) from which an installment option applies for each currency.

## 2025/09/24

RESOURCE:

- [Fulfillment Orders](/api-documentation/resources/fulfillment-order)

SECTION:

- [Fulfillment Orders Shipping Carrier](/api-documentation/resources/fulfillment-order#carrier)

DESCRIPTION:

- Added `app_id` field to Fulfillment Orders Shipping Carrier.

## 2025/09/23

RESOURCE:

- [Transaction](/api-documentation/resources/transaction)

SECTION:

- [Transaction](/api-documentation/resources/transaction)

- [Transaction Events](/api-documentation/resources/transaction#transaction-events)

DESCRIPTION:

- Added `payment_provider_tax_id` field to Transaction resource.

- Added `authorization_code` field to Transaction Events resource.

- Alter Payment provider installation guide to reflect the new changes

## 2025/09/22

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [POST /orders](/api-documentation/resources/order#post-orders)

- [Payment Gateway](/api-documentation/resources/order#payment-gateway)

- [Shipping Method](/api-documentation/resources/order#shipping-method)

DESCRIPTION:

- Added estimated delivery date fields (shipping_min_days and shipping_max_days) for order creation.

- Removed native Apps as possible values within the payment method (gateway) and shipping method (shipping) fields.

## 2025/09/18

RESOURCE:

- [Orders](/api-documentation/resources/order)

SECTION:

- [POST /orders](/api-documentation/resources/order#post-orders)

DESCRIPTION:

- Update shipping address number type.

## 2025/09/03

RESOURCE:

- [Coupon](/api-documentation/resources/coupon)

SECTION:

- [Properties](/api-documentation/resources/coupon#properties)

- [POST /coupons](/api-documentation/resources/coupon#post-coupons)

- [PUT /coupons/{id}](/api-documentation/resources/coupon#put-couponsid)

DESCRIPTION:

- Added new optional boolean field `only_cheapest_shipping` to Coupon resource.

## 2025/08/29

RESOURCE:

- Disputes

DESCRIPTION:

- Remove Disputes resource documentation (for now it remains in the `unstable` version due to pending modifications).

## 2025/08/15

RESOURCE:

- [Webhook](/api-documentation/resources/webhook)

DESCRIPTION:

- Adds `customer` webhooks for the events: `created`, `updated` and `deleted`

## 2025/08/12

RESOURCE:

- [Location](/api-documentation/resources/location)

SECTION:

- [Properties](/api-documentation/resources/location)

DESCRIPTION:

- Removing `allows_pickup` from location properties.

## 2025/07/25

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

SECTION:

- [POST /your_callback_url](/api-documentation/resources/shipping-carrier#post-your_callback_url)

DESCRIPTION:

- Added support for a new `cart_id` field in the payload sent to each application's callback_url during shipping quotation requests.

- The `cart_id` field may be `null` in some cases.

- Updated example for your_callback_url to reflect the inclusion of the `cart_id` field.

## 2025/06/25

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION:

- [Cancel Payment API](/api-documentation/guides/payment-provider#cancel-payment-api)

DESCRIPTION:
Clarified when the Cancel Payment API is triggered, detailing the specific error and timeout scenarios that prompt its invocation.

## 2025/06/24

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [GET /fulfillment-orders](/api-documentation/resources/fulfillment-order#endpoints)

- [GET /fulfillment-orders/{fulfillment_order_id}](/api-documentation/resources/fulfillment-order#endpoints)

- [DELETE /fulfillment-orders/{fulfillment_order_id}](/api-documentation/resources/fulfillment-order#endpoints)

- [POST /fulfillment-orders/{fulfillment_order_id}/tracking-events](/api-documentation/resources/fulfillment-order#endpoints)

- [PUT /fulfillment-orders/{fulfillment_order_id}/tracking-events/{fulfillment_order_tracking_event_id}](/api-documentation/resources/fulfillment-order#endpoints)

- [PATCH /fulfillment-orders/{fulfillment_order_id}](/api-documentation/resources/fulfillment-order#endpoints)

DESCRIPTION:

- The fixed API version and the `{store_id}` parameter have been removed from the request examples for the following methods: GET, POST, DELETE, PATCH, and PUT.

## 2025/06/23

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

- [Shipping Carrier App Development Guide](/api-documentation/guides/shipping-provider)

SECTION:

- [Partner account and creation of the APP](/api-documentation/guides/shipping-provider#partner-account-and-creation-of-the-app)

DESCRIPTION:

- This update adds a note clarifying that apps must request permission to access the Shipping scope through our public API.
In order to use the Shipping endpoints, the app must be registered in the Partners Portal and have explicit authorization granted by our Partner Support Team.

## 2025/06/11

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION:

- [Process Payment API](/api-documentation/guides/payment-provider#process-payment-api)

- [Cancel Payment API](/api-documentation/guides/payment-provider#cancel-payment-api)

- [Payment Status API](/api-documentation/guides/payment-provider#payment-status-api)

DESCRIPTION:

- Updated the Payment Provider guide to reflect an increased timeout duration (from 10 to 20 seconds) for the Process Payment, Cancel Payment, and Payment Status APIs.

## 2025/06/02

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [PATCH /products/stock-price](/api-documentation/resources/product#patch-productsstock-price)

DESCRIPTION:

- Add a note clarifying that the example is for a single warehouse, and include a link to the documentation with an example for multiple warehouses.

## 2025/05/19

RESOURCE:

- [Postman Collection for Tiendanube/Nuvemshop API](/api-documentation/utils/postman-collections)

SECTION:

- [Downloading the collection](/api-documentation/utils/postman-collections#downloading-the-collection)

DESCRIPTION:

- Update Postman Collection with new API endpoints.

## 2025/05/05

RESOURCE:

- [Order](/api-documentation/resources/order)

- [Product](/api-documentation/resources/product)

SECTION:

- [GET /orders](/api-documentation/resources/order#get-orders)

- [GET /products](/api-documentation/resources/product#get-products)

DESCRIPTION:

- Clarification on API Default Result Limit.

## 2025/05/01

RESOURCE:

- [Shipping Carrier App Development Guide](/api-documentation/guides/shipping-provider)

SECTION:

- [The Code parameter](/api-documentation/guides/shipping-provider#the-code-parameter)

DESCRIPTION:

- Clarify that the `reference` field in shipping rates must be a non-null string for rates to be visible in the store.

## 2025/04/24

RESOURCE:

- [Order](/api-documentation/resources/order)

- [Cart](/api-documentation/resources/cart)

DESCRIPTION:

- Added new endpoints `/orders/id/history/values` and `/orders/id/history/editions/` to the Order resource.

- Removed deprecated shipping properties from the Order resource in favor of Fulfillment Order properties.

- Removed Order Multi Inventory resource, all relevant information was moved to the Order resource.

- Updated Order resource properties to reflect new possible statuses and properties.

- Updated Cart API for new endpoint [for fetching a Cart](/api-documentation/resources/cart).

## 2025/04/21

RESOURCE:

- [Authentication](/api-documentation/authentication)

SECTION:

- [Common Problems](/api-documentation/authentication#common-problems)

DESCRIPTION:

- Add two new items to the "Common problems" section:

Curl request with `code` set to **null**

- Requesting partner credentials when accepting the app installation

## 2025/04/11

RESOURCE:

- [Business Rules](/api-documentation/resources/business-rules)

SECTION:

- [Callback response format definition](/api-documentation/resources/business-rules#callback-response-format-definition)

DESCRIPTION:

- Add clarification about the 800ms timeout.

## 2025/03/04

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

DESCRIPTION:

- Remove 'WIP: This resource is in development and not available yet.'

## 2025/03/27

RESOURCE:

- [Billing New endpoints](/api-documentation/resources/billing)

- [Authentication for partner actions](/api-documentation/guides/authentication-for-partner-actions)

- [Webhooks](/api-documentation/resources/webhook)

SECTION:

- [Subscription Updated webhook](/api-documentation/resources/webhook#subscriptionupdated)

DESCRIPTION:

- New billing API

- New authentication method for some endpoints

- New webhook for billing API

## 2025/02/20

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION:

- [Process Payment API](/api-documentation/guides/payment-provider#process-payment-api)

- [Cancel Payment API](/api-documentation/guides/payment-provider#cancel-payment-api)

- [Payment Status API](/api-documentation/guides/payment-provider#payment-status-api)

DESCRIPTION:

- Clarification about the 10,000ms timeout in Payment API.

## 2025/02/17

RESOURCE:

- [FulfillmentOrder](/api-documentation/resources/fulfillment-order)

SECTION:

- [FulfillmentOrderTrackingInfoHistory](/api-documentation/resources/fulfillment-order#fulfillmentordertrackinginfohistory)

- [GetFulfillmentOrder](/api-documentation/resources/fulfillment-order#get-v11000orders123456fulfillment-orders)

- [GetFulfillmentOrderById](/api-documentation/resources/fulfillment-order#get-v11000orders123456fulfillment-orders01fhzxhk8ptp9fvk99z66gxass)

DESCRIPTION:

- We are adding the TrackingInfoHistory field. This field will be populated whenever a change occurs in TrackingInfo.

## 2025/01/30

RESOURCE:

- [Store](/api-documentation/resources/store)

SECTION:

- [Properties](/api-documentation/resources/store#properties)

DESCRIPTION:

- Remove the `has_multi_cd` property.

## 2025/01/28

RESOURCE:

- [Orders](/api-documentation/resources/order)

SECTION:

- [Properties](/api-documentation/resources/order#properties)

DESCRIPTION:

- Add the `same_billing_and_shipping_address` parameter documentation.

## 2025/01/24

RESOURCE:

- [Category](/api-documentation/resources/category)

SECTION:

- [POST /categories](/api-documentation/resources/category#post-categories)

DESCRIPTION:

- Decrease the maximum number of categories that can be created from 5000 to 1000

## 2025/01/24

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [GET /products](/api-documentation/resources/product#get-products)

DESCRIPTION:

- Add the `ids` parameter to the **GET /products** endpoint. Up to 30 `ids` can be included.

## 2025/01/14

RESOURCE:

- [Orders](/api-documentation/resources/order)

SECTION:

- [Properties](/api-documentation/resources/order#properties)

DESCRIPTION:

- Add the `products.id` field, which identifies the line item ID.

- Clarification on the data type of the products.id field (it can exceed int32).

## 2024/12/24

RESOURCE:

- Disputes

DESCRIPTION:

- Added Disputes resource documentation.

## 2024/12/20

RESOURCE:

- [Orders](/api-documentation/resources/order)

SECTION:

- [Properties](/api-documentation/resources/order#properties)

DESCRIPTION:

- Clarification on sending the same `variant_id` but as separate items (different `properties` values).

## 2024/12/18

RESOURCE: [resources/openapi/discounts/openapi.yml](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

DESCRIPTION:

- Add `combines_with_other_discounts` attribute to the POST promotions payload

## 2024/12/05

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

SECTION:

- [Example requests for shipping rates](/api-documentation/resources/shipping-carrier#example-requests-for-shipping-rates)

DESCRIPTION:

- Add `origin.location_id` and `carrier` object with its fields in the example.

## 2024/11/25

RESOURCE:

- [FulfillmentOrder](/api-documentation/resources/fulfillment-order)

SECTION:

- [FulfillmentOrderStatus](/api-documentation/resources/fulfillment-order#fulfillmentorderstatus)

- [Workflow](/api-documentation/resources/fulfillment-order#workflow)

DESCRIPTION:

- Deprecation of `MARKED_AS_FULLFILED` status.
The `MARKED_AS_FULLFILED` status was originally created to indicate "manual" actions to indicate that Fulfillment Orders were dispatched, but it has no practical use. The correct status to indicate that a Fulfillment Order was dispatched is the `DISPATCHED` status.

- Deprecation of the `READY_TO_SHIP` status.
The `READY_FOR_SHIP` status has no practical use, in fact its status can be considered the same as `PACKED`.

- Create a guide for Fulfillment Order Status Workflow.
Update the documentation indicating the workflow for the Fulfillment Order status by Fulfillment Order Shipping Types.

## 2024/11/06

RESOURCE: [resources/discounts](/api-documentation/resources/discounts), [resources/openapi/discounts/openapi.yml](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

DESCRIPTION:

- Remove `shipping_line` value from allocation_type

## 2024/11/04

RESOURCE:

- [Discount](/api-documentation/resources/discounts)

SECTION:

- [FAQ](/api-documentation/resources/discounts#faq)

DESCRIPTION:

- Add that the API timeout is 800ms.

## 2024/10/28

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

SECTION:

- [Circuit Breaker for Unstable Shipping Carrier](/api-documentation/resources/shipping-carrier#circuit-breaker-for-unstable-shipping-carrier)

DESCRIPTION:

- Updated Circuit Breaker doc to shipping carriers.

## 2024/10/28

RESOURCE:

- [Customer](/api-documentation/resources/customer)

SECTION:

- [Properties](/api-documentation/resources/customer#properties)

DESCRIPTION:

- Added fields `accepts_marketing` and `accepts_marketing_updated_at`. The `accepts_marketing` field is read-only in the API.

## 2024/10/28

RESOURCE:

- [Scripts](/api-documentation/resources/fulfillment-order)

SECTION:

- [POST /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events](/api-documentation/resources/fulfillment-order#post-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-events)

- [PUT /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events/||{tracking_event_id}}](/api-documentation/resources/fulfillment-order#put-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-eventsfulfillment_order_tracking_event_id)

DESCRIPTION:

- Adding notes on create and update tracking events. Now, if the status is DELIVERED, the fulfillment order will be marked as DELIVERED and fulfilled.

- Adding notes on create tracking events. Now, tracking event will be limited to a maximum of 100 events. An additional 101st event may be delivered.

- Adding notes on create tracking events. Now, tracking event must differ from the previous one.

## 2024/10/01

RESOURCE:

- [Coupon](/api-documentation/resources/coupon)

DESCRIPTION:

- Add Products restriction to Coupon resource.

- Update displayed Category fields in Coupon API responses.

- Rewrite list of Coupon types.

## 2024/09/30

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

SECTION:

- [Providing rates to our merchants](/api-documentation/resources/shipping-carrier#providing-rates-to-our-merchants)

DESCRIPTION:

- Clarification on the use of `code` in rates with *pickup* options.

## 2024/09/30

- [FulfillmentOrder](/api-documentation/resources/fulfillment-order)

SECTION:

- [Fulfillment Order Status](/api-documentation/resources/fulfillment-order#fulfillmentorderstatus)

- [Patch /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}](/api-documentation/resources/fulfillment-order#patch-v1store_idordersorder_idfulfillment-ordersfulfillment_order_id)

- [POST /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events](/api-documentation/resources/fulfillment-order#post-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-events)

- [PUT /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events/{tracking_event_id}](/api-documentation/resources/fulfillment-order#put-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-eventsfulfillment_order_tracking_event_id)

DESCRIPTION:

- Adding new Fulfillment Order status: READY_FOR_SHIP

- Adding notes on update fulfillment orders. Now, if the status is MARKED_AS_FULFILLED or DELIVERED, the fulfillment order will be marked as fulfilled

- Adding notes on create and update tracking events. Now, if the status is READY_FOR_PICKUP or DELIVERED, the fulfillment order will be marked as DELIVERED and fulfilled

## 2024/09/23

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [FAQ](/api-documentation/resources/order#faq)

DESCRIPTION:

- Clarification about fields in the API when the 'Factura A' checkbox is checked (Only Argentinian stores).

## 2024/09/23

RESOURCE:

- [Scripts](/api-documentation/resources/script)

SECTION:

- [Scripts Management](/api-documentation/resources/script#scripts-management)

- [Scripts Public API Endpoints](/api-documentation/resources/script#scripts-public-api-endpoints)

DESCRIPTION:

- Fixed script public api parameters to follow the snake_case application standard

## 2024/09/19

RESOURCE:

- [Scripts](/api-documentation/resources/script)

SECTION:

- [Scripts Management](/api-documentation/resources/script#scripts-management)

DESCRIPTION:

- Added note explaining the parameters and app scripts relationship more in-depth

## 2024/09/19

RESOURCE:

- [Scripts](/api-documentation/resources/script)

SECTION:

- [Important](/api-documentation/resources/script#important)

- [Script code](/api-documentation/resources/script#script-code)

- [Scripts Management](/api-documentation/resources/script#scripts-management)

- [Scripts Public API Endpoints](/api-documentation/resources/script#scripts-public-api-endpoints)

DESCRIPTION:

- Modifies past documentation with whole new organization

- Added "Important" section to add disclaimers necessary for developers to be aware of

- Script code describes the script and available resources to be used within it (the script file will later be the "Script Version")

- Scripts Management section describes how scripts are not organized and registered in Tiendanube's platform

- Scripts Public API Endpoints describes the changes that are related to the script in the public API and describes the endpoint's payload

## 2024/09/18

- [resources/order](/api-documentation/resources/order)

DESCRIPTION:

- Added `billing_fiscal_regime` and `billing_invoice_use` field specification.

## 2024/09/17

RESOURCE:

- [Coupon](/api-documentation/resources/coupon)

DESCRIPTION:

- Added `combines_with_other_discounts` field specification.

## 2024/09/13

RESOURCE:

- [Business Rules](/api-documentation/resources/business-rules)

SECTION:

- [GET {store_id}/payment_providers/options](/api-documentation/resources/business-rules#get-store_idpayment_providersoptions)

- [GET {store_id}/shipping_carriers/options](/api-documentation/resources/business-rules#get-store_idshipping_carriersoptions)

DESCRIPTION:

- Modify the "Bearer" header of the examples to lowcase -> "bearer".

## 2024/09/06

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [FulfillmentOrderTrackingInfoInput](/api-documentation/resources/fulfillment-order#fulfillmentordertrackinginfoinput)

- [PATCH /v1/{store_id}/orders/{order_id}/fulfillment-orders/{fulfillment_order_id}](/api-documentation/resources/fulfillment-order#patch-v1store_idordersorder_idfulfillment-ordersfulfillment_order_id)

DESCRIPTION:

- Add parameter notify_customer in PATCH of Fulfillment Order.

## 2024/09/03

RESOURCE:

- [Draft order](/api-documentation/resources/draft-order)

SECTION:

- [POST /draft_orders ](/api-documentation/resources/draft-order#post-draft_orders)

DESCRIPTION:

- Add `properties` field in POST /draft-orders payload.

## 2024/09/02

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION:

- [Process Payment API](/api-documentation/guides/payment-provider#process-payment-api)

DESCRIPTION:

- Updated the definition of the `payment->attemptId` field in the payment processing request payload.

## 2024/08/27

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [GET /orders](/api-documentation/resources/order#get-orders)

DESCRIPTION:

- Add `aggregates` parameter in GET /orders.

## 2024/08/27

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

- [Transaction](/api-documentation/resources/transaction)

SECTION:

- [Payment Status API](/api-documentation/guides/payment-provider#payment-status-api)

- [POST /orders/{order_id}/transactions](/api-documentation/resources/transaction#endpoints)

DESCRIPTION:

- Update transaction's info object to be required.

## 2024/08/15

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [Shipping_Address](/api-documentation/resources/order#shipping_address)

DESCRIPTION:

- Add clarification of the default value of the shipping_address.phone field

## 2024/08/13

RESOURCE:

- [Business Rules](/api-documentation/resources/business-rules)

SECTION:

- [Examples](/api-documentation/resources/business-rules#examples)

DESCRIPTION:

- Fixing example for event `location/prioritization`.

## 2024/08/12

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

- [Transaction](/api-documentation/resources/transaction)

SECTION:

- [Payment Status API](/api-documentation/guides/payment-provider#payment-status-api)

- [Transaction Info](/api-documentation/resources/transaction#transaction-info)

DESCRIPTION:

- Update expected response for the Payment Status API.

- Change `external_id` field to be required for new implementations.

## 2024/08/07

RESOURCE:

- [Checkout SDK](/api-documentation/resources/order)

SECTION:

- [Events](/api-documentation/resources/order#shipping_address)

DESCRIPTION:

- Change Customer `name` property in Shipping_Address for `first_name` and `last_name`.

## 2024/07/29

RESOURCE:

- [Checkout SDK](/api-documentation/resources/checkout_sdk)

SECTION:

- [Events](/api-documentation/resources/checkout_sdk#events)

DESCRIPTION:

- Add LINE_ITEMS_UPDATED Checkout SDK event

## 2024/07/27

RESOURCE:

- [Script](/api-documentation/resources/script)

SECTION:

- [Available events](/api-documentation/resources/script#event-field)

DESCRIPTION:

- Specify approval requirements for scripts using onload event. Approval needed for storefront or storefront+checkout scripts; not required for checkout-only scripts.

## 2024/07/17

RESOURCE:

- [Payment Provider](/api-documentation/resources/payment-provider)

SECTION:

- [Supported Banks](/api-documentation/resources/payment-provider#supported-banks)

DESCRIPTION:

- Add support for Chilean banks.

## 2024/07/13

RESOURCE:

- [Intro](/api-documentation/intro)

SECTION:

- [Making a request](/api-documentation/intro#making-a-request)

DESCRIPTION:

- Remove space in Authentication header from curl.

## 2024/07/11

RESOURCE:

- [Webhook](/api-documentation/resources/webhook)

SECTION:

- [Verifying a webhook](/api-documentation/resources/webhook#verifying-a-webhook)

DESCRIPTION:

- Modify header `X-Linkedstore-HMAC-SHA256` to `x-linkedstore-hmac-sha256`.

## 2024/07/05

RESOURCE:

- [Coupon](/api-documentation/resources/coupon)

SECTION:

- [Properties](/api-documentation/resources/coupon#properties)

- [Filter properties](/api-documentation/resources/coupon#filtering-properties)

- [POST /coupons](/api-documentation/resources/coupon#post-coupons)

DESCRIPTION:

- Add *first_consumer_purchase* attribute and filter properties.

## 2024/07/03

RESOURCE:

- [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION:

- [FulfillmentOrderLineItem](/api-documentation/resources/fulfillment-order#fulfillmentorderlineitem)

- [Discounts](/api-documentation/resources/fulfillment-order#fulfillmentorderdiscount)

DESCRIPTION:

- Adding fulfillment order line item id in FulfillmentOrderLineItem.

- Adding fulfillment order line item external id in FulfillmentOrderLineItem.

- Adding fulfillment order discounts in FulfillmentOrder.

## 2024/07/03

RESOURCE:

- [Postman Collection for Tiendanube/Nuvemshop API](/api-documentation/utils/postman-collections)

SECTION:

- [Downloading the collection](/api-documentation/utils/postman-collections#downloading-the-collection)

DESCRIPTION:

- Add new endpoint (Business Rules) to the Postman collection:

PUT {store_id}/business_rules/integrations/location

## 2024/06/27

RESOURCE:

- [Business Rules](/api-documentation/resources/business-rules)

SECTION:

- [Domain](/api-documentation/resources/business-rules#domains)

- [Events](/api-documentation/resources/business-rules#events)

- [Partner's API](/api-documentation/resources/business-rules#partners-api)

DESCRIPTION:

- Adding new Location Prioritization documentation for Partners APIs.

## 2024/06/25

RESOURCE: [Abandoned Checkout](/api-documentation/resources/abandoned-checkout)

SECTION:

- [POST /checkouts/{cart_id}/coupon](/api-documentation/resources/abandoned-checkout#post-checkoutscart_idcoupon)

DESCRIPTION:

- Fix the title of endpoint POST /checkouts/{cart_id}/coupons to POST /checkouts/{cart_id}/coupon

## 2024/06/24

RESOURCE: [Postman Collection for Tiendanube/Nuvemshop API](/api-documentation/utils/postman-collections)

SECTION:

- [Downloading the collection](/api-documentation/utils/postman-collections#downloading-the-collection)

DESCRIPTION:

- Add new endpoints (Business Rules) to the Postman collection:

GET {store_id}/shipping_carriers/options

- GET {store_id}/payment_providers/options

- PUT {store_id}/business_rules/integrations/shipping

- PUT {store_id}/business_rules/integrations/payments

## 2024/06/19

RESOURCE: [Order](/api-documentation/resources/order)

SECTION:

- [POST /orders](/api-documentation/resources/order#post-orders)

DESCRIPTION:

- Update the default value of field `payment_status` in endpoint POST /orders. Is **pending**.

## 2024/06/19

RESOURCE:

- [resources/order](/api-documentation/resources/order)

SECTION:

- [properties](/api-documentation/resources/order#get-ordersid)

DESCRIPTION:

- Add billing_customer_type,billing_business_name,billing_trade_name,billing_state_registration and billing_document_type property to order.

## 2024/06/14

RESOURCE: [Product](/api-documentation/resources/product)

SECTION:

- [GET /products](/api-documentation/resources/product#get-products-1)

- [GET /products/1234](/api-documentation/resources/product#get-products1234)

- [POST /products](/api-documentation/resources/product#post-products-2)

- [PUT /products/5123](/api-documentation/resources/product#put-products5123)

DESCRIPTION:

- Add tags field in response examples of Products.

RESOURCE: [Checkout](/api-documentation/resources/checkout)

DESCRIPTION:

- Remove code from deprecated payment request integration and add *version* field to Payment Option examples.

## 2024/06/12

RESOURCE:

- [Business Rules](/api-documentation/resources/business-rules)

DESCRIPTION:

- Added Business Rules resource documentation.

RESOURCE: [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION: [JS Script Methods](/api-documentation/guides/payment-provider#js-script-methods)

DESCRIPTION:

- Add specification of the *version* field of the Payment Option object.

RESOURCE: [Checkout](/api-documentation/resources/checkout)

DESCRIPTION:

- Remove code from deprecated payment request integration and add *version* field to Payment Option examples.

## 2024/06/11

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [PUT /products/{id}](/api-documentation/resources/product#put-productsid)

DESCRIPTION:

- Add note on how to keep current category without replacing it by mistake.

## 2024/06/10

RESOURCES:

- [Category Custom Fields](/api-documentation/resources/categories/custom-fields#faq)

- [Customer Custom Fields](/api-documentation/resources/customers/custom-fields#faq)

- [Order Custom Fields](/api-documentation/resources/orders/custom-fields#faq)

- [Product Custom Fields](/api-documentation/resources/products/custom-fields#faq)

- [Product Variant Custom Fields](/api-documentation/resources/products/variants/custom-fields#faq)

DESCRIPTION:

- Updates the FAQ section *"How to associate or disassociate a custom-field with a specific entity?"*

## 2024/06/05

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [Properties](/api-documentation/resources/product#properties)

- [FAQ](/api-documentation/resources/product#faq)

DESCRIPTION:

- Add clarification on attribute/variants limit per product.

## 2024/06/05

RESOURCE: [Webhooks](/api-documentation/resources/webhook)

DESCRIPTION:

- Add information about deduplication of messages

## 2024/05/31

RESOURCE:

- [resources/coupon](/api-documentation/resources/coupon)

SECTION:

- [properties](/api-documentation/resources/coupon#properties)

DESCRIPTION:

- Add includes_shipping property to coupon.

## 2024/05/28

RESOURCE: [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION: [Implement the Payment Processing Flow](/api-documentation/guides/payment-provider#step-5-implement-the-payment-processing-flow)

DESCRIPTION:

- Add documentation related to the new Cancel Payment and Payment Status APIs.

RESOURCE: [Checkout](/api-documentation/resources/checkout)

SECTION: [Payment Option Examples](/api-documentation/resources/checkout#examples)

DESCRIPTION:

- Deprecate old payment option integration and add `processPayment` examples in JS script.

## 2024/05/27

RESOURCE:

- [Product Custom Fields](/api-documentation/resources/products/custom-fields)

- [Product Variant Custom Fields](/api-documentation/resources/products/variants/custom-fields)

SECTION:

- [FAQ](/api-documentation/resources/products/custom-fields#faq)

- [FAQ](/api-documentation/resources/products/variants/custom-fields#faq)

DESCRIPTION:

- ADD FAQ question with clarification on the use of custom fields as a filter in the store.

## 2024/05/24

RESOURCE:

- [Product Image](/api-documentation/resources/product-image)

SECTION:

- [GET /products/{product_id}/images/{image_id}](/api-documentation/resources/product-image#get-productsproduct_idimagesimage_id)

DESCRIPTION:

- Add {image_id} in title of endpoint to return a single product image.

## 2024/05/22

RESOURCE:

- [Order](/api-documentation/resources/order)

- [Order - Multi Inventory Preview](/api-documentation/v1/resources/order-multi-inventory)

SECTION:

- [Payment Details](/api-documentation/resources/order#payment-details)

- [Payment Details](/api-documentation/v1/resources/order-multi-inventory#payment-details)

DESCRIPTION:

- Fixed `payment_details.installments` field definition.

## 2024/05/06

RESOURCE: [Webhooks](/api-documentation/resources/webhook)

DESCRIPTION:

- Add new Orders webhook: order/edited

## 2024/05/03

RESOURCE:

- [Getting Started](/api-documentation/intro)

SECTION:

- [Rate Limiting](/api-documentation/intro#rate-limiting)

- [Pagination](/api-documentation/intro#pagination)

DESCRIPTION:

- Change response headers to lowercase: x-rate-limit-limit, x-rate-limit-remaining, x-rate-limit-reset, x-total-count, x-main-language.

## 2024/05/02

RESOURCE:

- [Webhooks](/api-documentation/resources/webhook)

SECTION:

- [Retry policies](/api-documentation/resources/webhook#retry-policies)

DESCRIPTION:

- Update the timeout value to 10 seconds.

## 2024/04/30

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [POST /orders](/api-documentation/resources/order#post-orders)

DESCRIPTION:

- Update request POST /orders adding location_id field

## 2024/04/26

RESOURCE:

- [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION:

- [Secure App Payment Processing Flow | Payload Signature](/api-documentation/guides/payment-provider#payload-signature)

DESCRIPTION:

- Improve the description of the payload signature verification process.

- Add example scripts of the verification process in Node.js, PHP and Bash languages.

## 2024/04/17

RESOURCE:

- [Script](/api-documentation/resources/script)

SECTION:

- [Available events](/api-documentation/resources/script#event-field)

DESCRIPTION:

- Correction of the email to contact.
[api@nuvemshop.com](mailto:api@nuvemshop.com) -> [api@nuvemshop.com.br](mailto:api@nuvemshop.com.br)

- Add explication about the email content:

`App_id`, `App_name`, funcionality of the script, and justification to charge `onload`.

## 2024/04/16

RESOURCE: [Intro](/api-documentation/intro)

SECTION: [Rate Limiting](/api-documentation/intro#rate-limiting)

DESCRIPTION:

- Add note about rate limit.

## 2024/04/12

RESOURCE:

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

- [Shipping Carrier App Development Guide](/api-documentation/guides/shipping-provider)

SECTION:

- [Providing rates to our merchants](/api-documentation/resources/shipping-carrier#providing-rates-to-our-merchants)

- [POST /shipping_carriers/{carrier_id}/options](/api-documentation/resources/shipping-carrier#post-shipping_carrierscarrier_idoptions)

- [The Code parameter](/api-documentation/guides/shipping-provider#the-code-parameter)

DESCRIPTION:

- Add aclaration about the code of Shipping Carrier Option and the rates.

## 2024/04/04

RESOURCE:

- [Draft order](/api-documentation/resources/draft-order)

SECTION:

- [POST /draft_orders](/api-documentation/resources/draft-order#post-draft_orders)

DESCRIPTION:

- Update request POST /draft-orders adding discount_type field

## 2024/04/04

RESOURCE:

- [Location](/api-documentation/resources/location)

SECTION:

- [PATCH /locations/priorities](/api-documentation/resources/location#patch-locationspriorities)

- [PATCH /locations/{id}/chosen-as-default](/api-documentation/resources/location#patch-locationsidchosen-as-default)

- [PUT /locations/{id}](/api-documentation/resources/location#put-locationsid)

DESCRIPTION:

- Updated request and response body examples with location id as ulid

- Update success response status code to 200 for PATCH /locations/priorities

- Update success response status code to 200 for PATCH /locations/{id}/chosen-as-default

- Update success response status code to 200 for PUT /locations/{id}

## 2024/03/28

RESOURCE:

- [Location](/api-documentation/resources/location)

SECTION:

- [PATCH /locations/priorities](/api-documentation/resources/location#patch-locationspriorities)

- [DELETE /locations/{id}](/api-documentation/resources/location#delete-locationsid)

- [PATCH /locations/{id}/chosen-as-default](/api-documentation/resources/location#patch-locationsidchosen-as-default)

DESCRIPTION:

- Add new endpoint PATCH /locations/priorities

- Add new endpoint PATCH /locations/{id}/chosen-as-default

- Document new rule from DELETE /locations/{id}

## 2024/03/04

RESOURCE:

- [Location](/api-documentation/resources/location)

SECTION:

- [GET /locations/{id}/inventory_levels](/api-documentation/resources/location#get-locationsidinventory-levels)

DESCRIPTION:

- Fix inventory levels route.

- Adding pagination to route.

## 2024/03/04

RESOURCE:

- [Location](/api-documentation/resources/location)

SECTION:

- [GET /locations/{id}/inventory_levels](/api-documentation/resources/location#get-locationsidinventory-levels)

DESCRIPTION:

- Fix title of inventory levels endpoint.

## 2024/02/27

RESOURCE:

- [Product](/api-documentation/resources/product)

SECTION:

- [POST /products](/api-documentation/resources/product#post-products)

DESCRIPTION:

- Add a note to recommend Partners to use /products/{product_id}/images endpoint in case it need insert a lot images

## 2024/02/26

RESOURCE:

- [Order](/api-documentation/resources/order)

SECTION:

- [GET /orders](/api-documentation/resources/order#get-orders)

DESCRIPTION:

- Add new fields to filter orders

## 2024/02/19

RESOURCE:

- [Discount](/api-documentation/resources/discounts)

DESCRIPTION:

- Add product.properties to callback body request

## 2024/02/05

RESOURCE:

- [Customer](/api-documentation/resources/customer)

- [Postman Collection for Tiendanube/Nuvemshop API](/api-documentation/utils/postman-collections)

SECTION:

- New Section [DELETE /customers/{id}]

- [Downloading the collection](/api-documentation/utils/postman-collections#downloading-the-collection)

DESCRIPTION:

- Add new endpoint: DELETE /customers/{id}.

## 2024/01/22

RESOURCE: [Product Image](/api-documentation/resources/product-image)

DESCRIPTION:

- Updating examples with webp flow

## 2024/01/16

RESOURCES:

- [Customer](/api-documentation/resources/customer)

- [Discount](/api-documentation/resources/discounts)

SECTIONS:

- [POST /customers](/api-documentation/resources/customer#post-customers)

- New Section [FAQ]

DESCRIPTION:

- Add FAQ with one question in resource 'discounts.md' (about Callback URL elimination).

- Add 'phone' field in example of customer creation (`POST /customers`).

## 2024/01/08

RESOURCE: [Postman Collection for Tiendanube/Nuvemshop API](/api-documentation/utils/postman-collections)

SECTION: [Downloading the collection](/api-documentation/utils/postman-collections#downloading-the-collection)

DESCRIPTION:

- Modify the archive postman.json (Postman Collection):

Add new resources with endpoints.

- Add endpoints in existing resources.

- Add new variables.
RESOURCE: N/A

DESCRIPTION:

- Update footer link for terms and conditions

## 2024/01/03

RESOURCES:

- [Category Custom Fields](/api-documentation/resources/categories/custom-fields)

- [Customer Custom Fields](/api-documentation/resources/customers/custom-fields)

- [Order Custom Fields](/api-documentation/resources/orders/custom-fields)

- [Product Custom Fields](/api-documentation/resources/products/custom-fields)

- [Product Variant Custom Fields](/api-documentation/resources/products/variants/custom-fields)

DESCRIPTION:

- Add section FAQ with two questions:
1.How to associate or disassociate a custom-field with a specific entity?
2.It's possible to delete all custom-fields with the DELETE endpoint?

## 2023/12/13

RESOURCE: [Webhooks](/api-documentation/resources/webhook)

DESCRIPTION:

- Updating response message when we have an 422 error for POST in Webhooks Endpoint.

## 2023/11/28

RESOURCES:

- [Order](/api-documentation/resources/order)

- [Product](/api-documentation/resources/product)

- [Shipping Carrier](/api-documentation/resources/shipping-carrier)

DESCRIPTION:

- Added message in Order API, Product API and Fulfillment Events API informing about the upcoming changes to support multi inventory.

## 2023/11/27

RESOURCE: [Shipping Carrier App Development Guide](/api-documentation/guides/shipping-provider)

SECTION: [Providing rates to our merchants](/api-documentation/guides/shipping-provider#the-code-parameter)

Description:

- Update the examples (add the Array 'rates' and modify the shipping carrier name to English).

- Add aclaration on how send one or more shipping rates in that Array.

- Add link to section where explain how the partner can providing rates.

## 2023/11/10

RESOURCE: [Product Custom Field](/api-documentation/resources/products/custom-fields)

DESCRIPTION:

- Documentation added to custom field endpoints for products.

## 2023/11/09

RESOURCE: [Category Custom Field](/api-documentation/resources/categories/custom-fields)

DESCRIPTION:

- Documentation added to custom field endpoints for categories.

## 2023/11/08

RESOURCES:

- [Order Custom Fields](/api-documentation/resources/orders/custom-fields)

- [Product Variants Custom Fields](/api-documentation/resources/products/variants/custom-fields)

- [Customers Custom Fields](/api-documentation/resources/orders/custom-fields)

DESCRIPTION:

- Updating custom field association payload

- Fixing HTTP return code when creating a custom field

## 2023/10/30

RESOURCE: [Customer Custom Field](/api-documentation/resources/customers/custom-fields)

DESCRIPTION:

- Including the link in the menu.

## 2023/10/19

RESOURCES:

- [Order](/api-documentation/resources/order)

- [Order-Multi-Inventory](/api-documentation/v1/resources/order-multi-inventory)

- [Draft-Order](/api-documentation/resources/draft-order)

- [Abandoned-Checkout](/api-documentation/resources/abandoned-checkout)

DESCRIPTION:

- Add "pos" alternative as a channel/storefront possible value.

# CHANGELOG

## 2023/10/18

RESOURCE: [Multi Inventory - How to access the new information of the Order](/api-documentation/guides/multi-inventory/access-order)

DESCRIPTION:

- Add warning regarding possible errors during fulfillment order creation.

## 2023/10/10

RESOURCE: [Customer Custom Field](/api-documentation/resources/customers/custom-fields)

DESCRIPTION:

- Documentation added to custom field endpoints for customers.

## 2023/10/05

RESOURCE: [Checkout](/api-documentation/resources/checkout)

SECTION: [Remove payment option loading](/api-documentation/resources/checkout#remove-payment-option-loading)

DESCRIPTION:

- Add explanation on how to use the Checkout.unLoadPaymentMethod() method

## 2023/09/20

RESOURCE: [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION: [Fulfillment Order Shipping Type](/api-documentation/resources/fulfillment-order#fulfillmentordershippingtype)

DESCRIPTION:

- Adding new fulfillment order shipping type: non-shippable.

RESOURCE: [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION: [Fulfillment Order Carrier Code Type](/api-documentation/resources/fulfillment-order#carriercodetype)

DESCRIPTION:

- Adding new fulfillment order carrier code type: draft and default.

RESOURCE: [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION: [Fulfillment Order Shipping Input](/api-documentation/resources/fulfillment-order#fulfillmentordershippinginput)

DESCRIPTION:

- Adding nullable for CarrierInput and OptionInput.

## 2023/08/28

RESOURCE: [Orders Custom Field](/api-documentation/resources/orders/custom-fields)

SECTION: [Get Single Order Custom Field](/api-documentation/resources/orders/custom-fields#get-orderscustom-fieldsid)

DESCRIPTION:

- Endpoint to list the data of a given order custom field.

RESOURCE: [Product Variants Custom Field](/api-documentation/resources/products/variants/custom-fields)

SECTION: [Get Single Product Variants Custom Field](/api-documentation/resources/products/variants/custom-fields#get-productsvariantscustom-fieldsid)

DESCRIPTION:

- Endpoint to list the data of a given product variant custom field.

## 2023/08/25

RESOURCE: [Webhook] (./resources/webhook.md)

SECTION: [About the ordering of messages](/api-documentation/resources/webhook#about-the-ordering-and-idempotency-of-messages)

DESCRIPTION:

- added context about the distributed nature of message queuing for the webhooks

## 2023/08/24

RESOURCE: [intro](/api-documentation/intro)

SECTION: [Help us make it better](/api-documentation/intro#help-us-make-it-better).

DESCRIPTION:

- change email to support

- added support in footer to redirect support section

## 2023/07/27

RESOURCE: [Transaction](/api-documentation/resources/transaction)

SECTION: [Refund URL](/api-documentation/resources/transaction#refund-url)

DESCRIPTION:

- Added new optional field `supports_partial_refund` to Transaction Info specification.

- Updated transaction refund request specification to cover partial refund use case.

## 2023/07/24

RESOURCE: [multi-inventory.md] (./guides/multi-inventory)

SECTION: Changes in how to inform shipping status changes for the order

DESCRIPTION:

- Changed endpoint to inform shipping status on a fulfillment order.

RESOURCE: [multi-inventory.md] (./guides/multi-inventory)

SECTION: Webhooks

DESCRIPTION:

- Documentation deleted related to webhooks for fulfillment_orders.

RESOURCE: [fulfillment-order.md] (./resources/fulfillment-order.md)

SECTION: Webhooks

DESCRIPTION:

- Documentation deleted related to webhooks for fulfillment_orders.

## 2023/06/28

RESOURCE: [resources/scripts](/api-documentation/resources/orders/custom-fields)

SECTION: n/a.

DESCRIPTION:

- Endpoint to list orders associated with a custom field.

- Endpoint to list custom fields associated with an order.

- Endpoint to associate a value with an order.

RESOURCE: [resources/scripts](/api-documentation/resources/products/variants/custom-fields)

SECTION: n/a.

DESCRIPTION:

- Endpoint to list product variants associated with a custom field.

- Endpoint to list custom fields associated with a product variant.

- Endpoint to associate a value with a product variant.

## 2023/06/23

RESOURCE: [Webhook](/api-documentation/resources/webhook)

SECTION: n/a.

DESCRIPTION:

- Including product variant custom fields webhooks events.

## 2023/06/22

RESOURCE: [Webhook](/api-documentation/resources/webhook)

SECTION: n/a.

DESCRIPTION:

- Including order custom fields webhooks events.

## 2023/05/29

RESOURCE: [resources/scripts](/api-documentation/resources/orders/custom-fields)

SECTION: n/a.

DESCRIPTION:

- Documentation added to custom field endpoints for orders.

RESOURCE: [resources/scripts](/api-documentation/resources/products/variants/custom-fields)

SECTION: n/a.

DESCRIPTION:

- Documentation added to custom field endpoints for product variants.

## 2023/05/19

RESOURCE: [Fulfillment Order](/api-documentation/resources/fulfillment-order)

SECTION: [Fulfillment Order](/api-documentation/resources/fulfillment-order)

DESCRIPTION:

- Change de Fulfillment Order Status MARK_AS_FULFILLED to MARKED_AS_FULFILLED.

## 2023/05/16

RESOURCE: [resources/payment-option](/api-documentation/resources/payment-option)

SECTION: [Payment Option](/api-documentation/resources/payment-option#properties)

DESCRIPTION:

- Added payment option resource documentation.

## 2023/04/28

RESOURCE: [resources/scripts](/api-documentation/resources/script)

SECTION: [Scripts](/api-documentation/resources/script#event-field)

DESCRIPTION:

- Changed script examples to use the OFI event.

- Changed the default value of script event property to OFI.

- Added the requirements to use the onload event in scripts.

## 2023/04/27

RESOURCE: [Payment Provider](/api-documentation/resources/payment-provider)

SECTION: [Appendix](/api-documentation/resources/payment-provider#appendix)

DESCRIPTION:

- Added more supported payment methods and banks.

## 2023/04/21

RESOURCE: [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION: [Secure App Payment Processing Flow](/api-documentation/guides/payment-provider#step-5-implement-the-payment-processing-flow)

DESCRIPTION:

- Added signature documentation to the secure app payment processing flow.

## 2023/04/13

RESOURCE: [resources/transactions](/api-documentation/resources/transaction)

SECTION: [Transaction Info](/api-documentation/resources/transaction#transaction-info)

DESCRIPTION:

- Added charges and discounts to Transaction Info object.

## 2023/04/12

RESOURCE: [Fulfillment Order](/api-documentation/resources/fulfillment-order)
RESOURCE: [Store](/api-documentation/resources/store)

SECTION: [Fulfillment Order](/api-documentation/resources/fulfillment-order)
SECTION: [Store](/api-documentation/resources/store)

DESCRIPTION:

- Add product with product_id on fulfillment order line item response

- Add new atribute `code` type `CarrierCodeType` in `Carrier` model

- Change FulfillmentOrderShipping.carrier.id to FulfillmentOrderShipping.carrier.carrier_id

- Add new atribute `has_multicd` in `Store` model for `Store API`.

## 2023/03/31

RESOURCE: [Webhooks](/api-documentation/resources/webhook)

SECTION: [Webhooks](/api-documentation/resources/webhook)

DESCRIPTION:

- Removed from category Theme.

## 2023/03/29

RESOURCE: [Authentication](/api-documentation/authentication)

SECTION: [Authorization Flow](/api-documentation/authentication#authorization-flow)

DESCRIPTION:

- Added sample App ID in body of `curl` call.

## 2023/03/15

RESOURCE: [Authentication](/api-documentation/authentication)

SECTION: [Authorization Flow](/api-documentation/authentication#authorization-flow)

DESCRIPTION:

- Added a required header to the `curl` call.

## 2023/03/09

RESOURCE: [Payment Provider App Development Guide](/api-documentation/guides/payment-provider)

SECTION: [Secure App Payment Processing Flow](/api-documentation/guides/payment-provider#step-5-implement-the-payment-processing-flow)

DESCRIPTION:

- Added documentation on the new flow to implement backend-to-backend app payment processing.

RESOURCE: [Payment Provider](/api-documentation/resources/payment-provider)

SECTION: [Authentication](/api-documentation/resources/payment-provider#authentication)

DESCRIPTION:

- Added new optional `authentication` field.

RESOURCE: [Checkout](/api-documentation/resources/checkout)

SECTION: [Checkout Context](/api-documentation/resources/checkout#checkout-context)

DESCRIPTION:

- Added new `Checkout` methods `processPayment` and `showErrorCode`.

## 2023/03/08

RESOURCE: [Authentication](/api-documentation/authentication)

SECTION: [Authorization Flow](/api-documentation/authentication#authorization-flow)

DESCRIPTION:

- Changing auth code lifetime to 5 minutes.

## 2023/03/06

RESOURCE: [Intro](/api-documentation/intro)

SECTION: [Rate Limiting](/api-documentation/intro#rate-limiting)

DESCRIPTION:

- Added rate limiting examples

## 2023/02/16

RESOURCE: [resources/store](/api-documentation/resources/store)

SECTION: [GET /store](/api-documentation/resources/store#get-store)

DESCRIPTION:

- Added whatsapp phone number field.

## 2023/02/14

RESOURCES:

- [How to adjust the creation of an order or draft order in a multi inventory environment](/api-documentation/guides/multi-inventory/create-order)

SECTION: n/a.

DESCRIPTION:

- Guide simplified since Order creation API will not be modified for now.

## 2023/02/14

RESOURCES:

- [guides/multi-inventory/products](/api-documentation/guides/multi-inventory/products)

SECTION:

- [GET /products/{id} - GET /products/{id}/variants](/api-documentation/guides/multi-inventory/products#get-productsid---get-productsidvariants)

DESCRIPTION:

- Added new section describing changes to GET endpoints.

## 2023/02/14

RESOURCES:

- [resources/fulfillment-order](/api-documentation/resources/fulfillment-order)

SECTION: n/a.

DESCRIPTION:

- Added fulfillment order line item variant information

- Added fulfillment order line item identification

- Removed fulfillment order line item order line item identification

- Added multi-inventory changes-to-fulfillment-events migrate description.

## 2023/02/13

RESOURCES:

- [resources/product-variant](/api-documentation/resources/product-variant)

SECTION:

- [Extra shipping days by Product Variant](/api-documentation/resources/product-variant#extra-shipping-days-by-product-variant)

DESCRIPTION:

- Added documentation for additional shipping days for product.

## 2023/02/07

RESOURCES:

- [resources/fulfillment-order](/api-documentation/resources/fulfillment-order)

SECTION: n/a.

DESCRIPTION:

- Added fulfillment order shipping pickup details pickup hours list property.

- Added fulfillment order shipping option allow free shipping property.

- Added fulfillment order shipping extra properties.

- Added fulfillment order shipping line item unit price.

- Added fulfillment order shipping line item unit dimension.

- Removed paginated response from GET /v1/{store_id}/orders/{order_id}/fulfillment-orders

## 2023/02/06

RESOURCES:

- [resources/fulfillment-order](/api-documentation/resources/fulfillment-order)

SECTION: n/a.

DESCRIPTION:

- Added fulfillment order status history.

## 2023/02/02

RESOURCES:

- [resources/checkout](/api-documentation/resources/checkout#payment-options-javascript-interface)

SECTION: n/a.

DESCRIPTION:

- Added information on how to send data from Local Storage to Partner's Backend

## 2023/02/01

RESOURCES:

- [How to adapt your app to manage stock from multiple locations](/api-documentation/guides/multi-inventory)

- [How to access the new information of the Order](/api-documentation/guides/multi-inventory/access-order)

- [How to adjust the creation of an order or draft order in a multi inventory environment](/api-documentation/guides/multi-inventory/create-order)

- [resources/fulfillment-order](/api-documentation/resources/fulfillment-order)

SECTION: n/a.

DESCRIPTION:

- Added new guide to adapt your app to a multi inventory environment.

- Added new guide for applications that need to adjust information sent when creating an order.

- Added new guide for applications that need to adjust information sent when creating an order.

- Added new Fulfillment Order resource.

## 2023/01/23

RESOURCE: [resources/order](/api-documentation/resources/order)

SECTION: [Order](/api-documentation/resources/order#invoices-eg-nfe-in-brazil)

DESCRIPTION:

- Changed the way NFe metafields should be created/read.

## 2023/01/23

RESOURCE: [getting started](/api-documentation/intro)

SECTION: [pagination](/api-documentation/intro#pagination)

DESCRIPTION:

- Updated default pagination to none. Partner must specify further pages with the `page` parameter.

## 2023/01/23

RESOURCE: [resources/scripts](/api-documentation/resources/script)

SECTION: [Scripts](/api-documentation/resources/script#script-code)

DESCRIPTION:

- Change jQuery injection.

## 2023/01/09

RESOURCE: [resources/discounts](/api-documentation/resources/discounts), [resources/openapi/discounts/openapi.yml](/api-documentation/assets/files/openapi-3d0ed1048885cb13b3dd90b39509e016.yml)

SECTION: [Message specifications](/api-documentation/resources/discounts#message-specifications)

DESCRIPTION:

- Added `coupons` property to callbacks body

## 2022/12/26

RESOURCE: [resources/category](/api-documentation/resources/category)

SECTION: [FAQ](/api-documentation/resources/category#faq)

DESCRIPTION:

- Added a new FAQ about adding a subcategory to an existing category.

## 2022/12/21

RESOURCE: [resources/order](/api-documentation/resources/order)

SECTION: [FAQ](/api-documentation/resources/order#faq)

DESCRIPTION:

- Added a new info about best practices on how to retrieve orders.

## 2022/12/06

RESOURCE: [Authentication](/api-documentation/authentication)

SECTION: [Common Problems](/api-documentation/authentication#common-problems)

DESCRIPTION:

- Added a common problems section.

## 2022/12/05

RESOURCE: [guides/installation](/api-documentation/guides/installation)

SECTION: n/a.

DESCRIPTION:

- Added a new guide about installation flow.

RESOURCE: [Resources/location](/api-documentation/resources/location)

SECTION: n/a.

DESCRIPTION:

- Added a new feature to manage locations.

## 2022/12/01

RESOURCE: [resources/product](/api-documentation/resources/product)

SECTION: [Update Stock and Price](/api-documentation/resources/product#patch-productsstock-price)

DESCRIPTION:

- Added new endpoint (PATCH /products/stock-price) docs.

## 2022/11/25

RESOURCE: [guides/payment-provider](/api-documentation/guides/payment-provider)

SECTION: [FAQs](/api-documentation/guides/payment-provider#faq)

DESCRIPTION:

- Added a FAQs section.

RESOURCE: [resources/category](/api-documentation/resources/category)

SECTION: [FAQs](/api-documentation/resources/category#faq)

DESCRIPTION:

- Added a FAQs section.

RESOURCE: [resources/product-variant](/api-documentation/resources/product-variant)

SECTION: [FAQs](/api-documentation/resources/product-variant#faq)

DESCRIPTION:

- Added a FAQs section.

## 2022/11/15

RESOURCE: [resources/order](/api-documentation/resources/order)

SECTION: [Properties](/api-documentation/resources/order#properties)

DESCRIPTION:

- Added de following properties to the table:

promotional_discount

- checkout_enabled

- shipping_suboption

- completed_at

- attributes

- cancelled_at

- closed_at

- read_at

- gateway_link

- shipping_carrier_name

- landing_url

- app_id

- Updated all the JSON examples

## 2022/11/14

RESOURCE: [resources/shipping_carrier](/api-documentation/resources/shipping-carrier)

SECTION: [Providing rates to our merchants](/api-documentation/resources/shipping-carrier#providing-rates-to-our-merchants)

DESCRIPTION:

- Added explanation of how price and price_merchant rules work for Partners of Tiendanube that want to integrate through our Shipping API

RESOURCE: [guides/shipping_carrier](/api-documentation/guides/shipping-provider)

SECTION: [Free Shipping in mixed carts](/api-documentation/guides/shipping-provider#free-shipping-in-mixed-carts)

DESCRIPTION:

- Added explanation of how price and price_merchant rules work for Partners of Tiendanube that want to integrate through our Shipping API

## 2022/08/15

Added:

- Resource

Webhook Section

Properties

Verifying a webhook

- Parameters

- Retry policies

- Required Webhooks

store/redact

- customers/redact

- customers/data_request

- Endpoints

GET /webhooks/

- GET /webhooks/{id}/

- POST /webhooks/

- PUT /webhooks/{id}/

- DELETE /webhooks/{id}/

- Transaction Section

Payment Method

- Transaction Info

- Card Info

- Installments Info

- Refund URL

- Transaction Events

- Money

- Transaction Status

- Transaction Event Types

- Transaction Event Status

- Transaction Event Info

- Transaction Event Workflow

- Transaction Status Workflow

- Redirect Transactions Discounts

- Endpoints

GET orders/transaction

- GET orders/{id}/transaction/{id}

- POST orders/{id}/transaction

- POST orders/{id}/transaction/{id}

- HTTP Errors List

- Common Examples

- Appendix

Transaction Failure Codes

- Store Section

Properties

- Endpoints

GET /store

- Shipping Carrier Section

Shipping Carrier Properties

- Shipping Carrier Options

- Shipping Carrier Options Properties

- Providing rates to our merchants

- Example requests for shipping rates

- Server-side caching of requests

- Endpoints

POST /shipping_carriers

- GET /shipping_carriers

- GET /shipping_carriers/{id}

- PUT /shipping_carriers/{id}

- DELETE /shipping_carriers/{id}

- POST /shipping_carriers/{carrier_id}/options

- GET /shipping_carriers/{carrier_id}/options

- GET /shipping_carriers/{carrier_id}/options/{option_id}

- PUT /shipping_carriers/{carrier_id}/options/{option_id}

- DELETE /shipping_carriers/{carrier_id}/options/{option_id}

- Fulfillment Events

GET orders/fulfillment

- GET orders/{id}/fulfillment

- POST orders/{id}/fulfillment

- DELETE orders/{id}/fulfillment

- Script Section

Variables

Store

- Checkout

- Properties

- Endpoints

GET /script/

- GET /script/{id}/

- POST /script/

- PUT /script/{id}/

- DELETE /script/{id}/

- Product Section

Properties

- Endpoints

GET /products/

- GET /products/{product_id}/

- POST /products/

- PUT /products/{product_id}/

- DELETE /products/{product_id}/

- Product Variant Section

Properties

- Endpoints

GET /products/{product_id}/variants

- GET /products/{product_id}/variants/{id}

- POST /products/{product_id}/variants

- PUT /products/{product_id}/variants/{id}

- DELETE /products/{product_id}/variants/{id}

- Product Image Section

Properties

- Endpoints

GET /products/{product_id}/images

- Size of images

- POST /products/{product_id}/images

- PUT /products/{product_id}/images/{id}

- DELETE /products/{product_id}/images/{id}

- Payment Provider Section

Properties

Logos

- Currency Codes

- Payment Method Types

- Payment Methods

- Rates

- Features

- Checkout Payment Options

- Money

- Endpoints

POST /payment_providers

- PUT /paymentproviders/{payment_provider_id}

- GET /payment_providers

- GET /paymentproviders/{payment_provider_id}

- DELETE /paymentproviders/{payment_provider_id}

- HTTP Errors List

Appendix

- Supported Payment Methods by Payment Method Type

- Order Section

Endpoints

GET orders

- GET orders{id}

- POST orders

- Object

- POST orders/{id}/close

- POST orders/{id}/open

- POST orders/{id}/pack

- POST orders/{id}/fullfill

- POST orders/{id}/cancel

- Invoices (e.g. NFe in Brazil)

- Metafields Section

Properties

- Endpoints

GET metafileds

- GET metafileds{id}

- POST metafileds

- PUT metafileds{id}

- DELETE metafileds{id}

- Draft Order Section

Endpoints

GET draft_order

- GET draft_order{id}

- POST draft_order

- PUT draft_order{id}

- DELETE draft_order{id}

- Discount Section

Main Concepts

Promotions and discounts

- Tier

- How it works

- Accountabilities

- Where do I start?

- Integration

Register a callback

- Create promotions

- Managing discounts

- Remove a discount

- Message specifications

- Request Life Cycle

- Cart Life Cycle

- Uninstalled apps

- Security

- Upcoming changes

Signed Communication

- Frequently Asked Questions

What happens if the server does respond properly?

- What happens if my discount is no longer valid?

- Resources

- Costumer Section

Properties

- Endpoints

- GET custumers

- GET custumers{id}

- POST custumers

- PUT custumers {id}

- Coupons Section

Endpoints

GET coupons

- GET coupons{id}

- POST coupons

- PUT coupons{id}

- DELETE coupons{id}

- Checkout SDK Section

Renders in the console the list of ids of active gateways in the store.

- Hide payment options

- Adds or changes discount and installment information for a gateway

- Adds extra information to the content of the external payment method

- Hide installments from the user's picklist

- Checkout Section

Payment Options (Javascript Interface)

- Examples

External Payment Option

- Card Payment Option

- Modal Payment Option

- Checkout Context

Checkout

- PaymentOptions

- Appendix

Checkout Runtime Error Codes

- Category Section

Notes

- Properities

- GET categories

- GET categories{id}

- POST categories

- PUT categories{id}

- DELETE categories{id}

- abandoned-checkout Section

- Notes

- Properities

- Abondoned Checkout

- Promotional Discount

- Products

- Payment Details

- Endpoint

GET /checkouts

- GET /checkouts/{checkout_id}

- POST /checkouts/{cart_id}/coupons

- Http erros examples

- Utils

- postman

Where do I start?

- Downloading the collection

- Import it into Postman

- Update variables

- lgpd-webhooks-testing-tool

intro

Scope

- Test Coverage

- Complexity

- Requirements

- Guides

- payment-provider

intro

Glossary

- Payment Provider

- Payment Method Type

- Payment Method ID

- Payment Option

- Integration Type

- Payment App

- Introduction

- Step 1: Partner Account and App Creation

- Step 2: App Installation and Payment Provider Creation Flow

- Step 3: Implementing the Checkout Flow

- Step 4: Transactions Implementation

- Order Management: Refunds and Chargebacks

- Infrastructure

- App Metadata

- shipping-provider

intro

Integration guide for shipping applications

- Setting-up

- Partner account and creation of the APP

- APP installation

- Get the access_token

- Creation of the Shipping Carrier

- Create shipping services (carrier_option)

Note 1:

- Note 2:

- Note 3:

- Note 4:

- Note 5:

- example:

- Shipping Rates

- Volumetry

- Treatment of rates

- Limits

- The Code parameter

Important:

- Example:

- About destination address

- Reference id

- Free Shipping in mixed carts

100% free shipping

- Mixed cart

- Shipment management

Notification of shipments

- How to create an admin link?

- What else can I use the Admin Links for?

- Process the order

- Reporting a tracking code

- Shipping status update

- Initial Setup

- Home

- template pull request

- codeowners