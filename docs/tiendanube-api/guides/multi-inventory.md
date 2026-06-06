---
title: How to adapt your app to manage stock from multiple locations
source: https://tiendanube.github.io/api-documentation/guides/multi-inventory
version: 2025-03
---

# How to adapt your app to manage stock from multiple locations

We are doing changes in our platform to support multi location inventory in 2023. This guide will explain how our APIs are changing and how apps can adapt to them.

Supporting multi location inventory means:

- Tracking inventory through multiple locations.

- Being able to choose the priority of the locations from which the stock is taken for an order.

- Allow shipping from multiple locations.

- Return inventory to the appropriate locations if an order is cancelled.

- Track stock movements at each location.

During the buying process, if there is a location that can deliver the entire order then the stock will be fulfilled from that location. If a single location cannot fulfill the whole order, then we will split the order fulfillment across different locations by creating multiple fulfillment. Merchants will be able to see the shipping option chosen for every different fulfillment.

## What does this mean for applications?

### Will your application be affected by these changes?

Your application will probably need to make changes if it uses *at least* one of the following scopes:

- read_products

- write_products

- read_orders

- write_orders

- read_draft_orders

- write_draft_orders

- read_shipping

- write_shipping

### API changes

We are going to introduce new objects in our APIs to be able to model multi location inventory.

New API objects (in purple) and their relationships.

#### Location API

With the introduction of multi location inventory, we evolved our merchants "store branches” into “locations”. These locations will now be connected to orders, shipping, and inventory.

We launched the [Location API](/api-documentation/resources/location) that allows apps to manage store's locations. In order to access these endpoints, new read_locations/write_locations permissions are needed.

**Important:** Apps will automatically receive the read_locations scope on all merchants' access_tokens if it already has any of the following scopes:

- read_shipping

- write_shipping

- read_products

- write_products

#### Product and Product Variant APIs

In order to support inventory at multiple locations, we are changing where we keep inventory information. The [Product Variant](/api-documentation/resources/product-variant) will stop having a single stock to have a list of inventory levels (Inventory_Level) which track the stock that exists in each location.

```
variant: { id: 1234, price: 25.00, stock: 20,+ inventory_levels: [...] \}
```

```
inventory_levels: [ { location_id: "01GR92YTFMN5CCBRHED586BTRG",+ stock: 5 }, { location_id: "01GR92ZRKF3G5P341CCTBKR35Y",+ stock: 15 }]
```

**Important:** to maintain backwards compatibility, `variant.stock` will exist with the total stock of the variant in all its locations. This means that if the store does not manage stock in multiple locations, apps will continue to work without any issues. But, if the store manages its stock in multiple locations, apps will not be ready to manage stock changes effectively.

#### Order and Fulfillment Order APIs

A new `Fulfillment Order` has been created to represent each fulfillment (shipments) linked to an order. Since a single line item in an order can be
fulfillment from multiple locations (only if quantity is more than 1) we have also created a `Fulfillment Order Line Item` object to model this scenario.

##### Managing multiple fulfillments

In order to support multiple fulfillment per order, we are changing where we store information associated with shipments. The order will stop having the shipping information and will start to have a list of fulfillments (IDs or details).

```
order: { id: 5678,- shipping: X,- shipping_*: X,- shipped_at: X,+ fulfillments: [...]}
```

This is described in details in the new [Fulfillment Order API](/api-documentation/resources/fulfillment-order).

In this table we show exactly how each field that was formerly in Orders is mapped to its respective value in each Fulfillment Order:

| Order V1 | Fulfillment Orders 
| order.shipping_name | fulfillment_order.recipient.name 
| order.shipping_phone | fulfillment_order.recipient.phone 
| order.shipping_address | fulfillment_order.destination.street 
| order.shipping_number | fulfillment_order.destination.number 
| order.shipping_floor | fulfillment_order.destination.floor 
| order.shipping_locality | fulfillment_order.destination.locality 
| order.shipping_zipcode | fulfillment_order.destination.zipcode 
| order.shipping_city | fulfillment_order.destination.city 
| order.shipping_province | fulfillment_order.destination.province.name 
| order.shipping_country | fulfillment_order.destination.country.name 
| order.shipping_min_days | fulfillment_order.shipping.min_delivery_date (non compatible type) 
| order.shipping_max_days | fulfillment_order.shipping.max_delivery_date (non compatible type) 
| order.shipping_cost_owner | fulfillment_order.shipping.owner_cost.value 
| order.shipping_cost_customer | fulfillment_order.shipping.owner_customer.value 
| order.shipping | fulfillment_order.shipping.carrier_id 
| order.shipping_option | fulfillment_order.shipping.option_name 
| order.shipping_option_code | fulfillment_order.shipping.option_code 
| order.shipping_option_reference | fulfillment_order.shipping.option_reference 
| order.shipping_pickup_details.* | fulfillment_order.shipping.pickup_details 
| order.shipping_pickup_details.name | fulfillment_order.shipping.pickup_details.name 
| order.shipping_pickup_details.address | fulfillment_order.shipping.pickup_details.address 
| order.shipping_pickup_details.city | fulfillment_order.shipping.pickup_details.city 
| order.shipping_pickup_details.province | fulfillment_order.shipping.pickup_details.province.name 
| order.shipping_pickup_details.pickup_hours | fulfillment_order.shipping.pickup_details.pickup_hours 
| order.shipping_tracking_number | fulfillment_order.tracking_info.number 
| order.shipping_tracking_url | fulfillment_order.tracking_info.url 
| order.shipping_store_branch_name | fulfillment_order.shipping.pickup_details.name 
| order.shipping_pickup_type | fulfillment_order.shipping.type 
| order.shipping_suboption | fulfillment_order.shipping.pickup_details 
| order.shipping_suboption.id | fulfillment_order.shipping.pickup_details.location_id 
| order.shipping_carrier_name | fulfillment_order.shipping.carrier_name 
| order.shipping_address.name | fulfillment_order.recipient.name 
| order.shipping_address.phone | fulfillment_order.recipient.phone 
| order.shipping_address.address | fulfillment_order.destination.street 
| order.shipping_address.number | fulfillment_order.destination.number 
| order.shipping_address.floor | fulfillment_order.destination.floor 
| order.shipping_address.locality | fulfillment_order.destination.locality 
| order.shipping_address.zipcode | fulfillment_order.destination.zipcode 
| order.shipping_address.city | fulfillment_order.destination.city 
| order.shipping_address.province | fulfillment_order.destination.province.name 
| order.shipping_address.country | fulfillment_order.destination.country.name 
| order.shipping_address.customers.reference | fulfillment_order.destination.reference 
| order.shipping_address.customers.between_streets | fulfillment_order.destination.between_streets 
| order.shipping_tracking_number | fulfillment_order.tracking_info.number 
| order.shipping_tracking_url | fulfillment_order.tracking_info.url 

**Important:** To maintain backwards compatibility, we will continue to maintain the shipping information in the Order, but with the values corresponding to the first Fulfillment:

- `order.shipping` → will return the value of `fulfillment_order.shipping.carrier_id` of the first Order Fulfillment.

- `order.shipping_*` → will return the corresponding value according to the table of the first Fulfillment of the Order.

- `order.shipped_at` → will return the date the first Order Fulfillment was shipped.

This means that if the store does not manage stock in multiple locations, apps will continue to work without any issues. But, if the store manages its stock in multiple locations, apps may show incorrect information regarding the order.

##### Changes in shipping cost calculation

The shipping cost calculation API will not receive any changes. In this way, Shipping Carriers do not have to change their current implementation for calculating shipping rates.

What will change are the amounts of calls that can be received per order. If during the purchase process, a cart has to calculate the shipping costs assuming that there are products that will be fulfilled from different locations, we will send one quote for each location to each Shipping Carrier.

##### Changes to Fulfillment Events

Fulfillment Events that used to be sent for the Order now have to be sent for every Fulfillment Order.
The object that represents the tracking status of a shipment is now called Tracking Events. We kept the same groups of resources, to obtain, create, update and delete Fulfillment Orders Tracking Events.

**See the example of equivalence between the APIs:**

**POST /orders/{id}/fulfillments**

```
{ "status": "delivered", "description": "Objeto entregue ao destinatário", "city": "São Paulo", "province": "São Paulo", "country": "BR", "happened_at": "2013-04-22T11:39:12-03:00", "estimated_delivery_at": "2013-04-22T11:39:12-03:00"}
```

**To POST /orders/{id}/fulfillment-orders/{id}/tracking-events**

```
{ "status": "delivered", "description": "Objeto entregue ao destinatário",+ "address": "Avenida Paulista, 15 São Paulo, São Paulo - Brasil",- "city": "São Paulo",- "province": "São Paulo",- "country": "BR", "happened_at": "2013-04-22T11:39:12-03:00", "estimated_delivery_at": "2013-04-22T11:39:12-03:00",+ "geolocation": {+ "longitude": 73.856077,+ "latitude": 40.848447+ }}
```

**This is a list of equivalence between the attributes of Orders Fulfillment Events V1 to Fulfillment Orders Tracking Events:**

| Order Fulfillment Events V1 | Fulfillment Order Tracking Events 
| fulfillment_events.id | fulfillment_order.tracking_events.id 
| fulfillment_events.status | fulfillment_order.tracking_events.status 
| fulfillment_events.descritpion | fulfillment_order.tracking_events.description 
| fulfillment_events.city | fulfillment_order.tracking_events.address (non compatible type) * 
| fulfillment_events.province | fulfillment_order.tracking_events.address (non compatible type) * 
| fulfillment_events.country | fulfillment_order.tracking_events.address (non compatible type) * 
| created_at | fulfillment_order.tracking_events.created_at 
| updated_at | fulfillment_order.tracking_events.updated_at 
| happened_at | fulfillment_order.tracking_events.happened_at 
| estimated_delivery_at | fulfillment_order.tracking_events.estimated_delivery_at 
| non exists | fulfillment_order.tracking_events.geolocation 

***It's up to each application to define how the tracking address is represented as a string. The fulfillment event's city, province and country could be informed in fulfilment_order.tracking_events.address by concatenating all the information. Eg.: "Some street 31, Some City, Some State, Some Country".**

**This is the full feature API resources endpoints equivalency list:**

| Endpoint (before) | Endpoint (now) 
| POST /orders/{id}/fulfillments | POST /orders/{id}/fulfillment-orders/{id}/tracking-events 
| GET /orders/{id}/fulfillments | GET /orders/{id}/fulfillment-orders/{id}/tracking-events 
| GET /orders/{id}/fulfillments/{id} | GET /orders/{id}/fulfillment-orders/{id}/tracking-events/{id} 
| DELETE /orders/{id}/fulfillments/{id} | DELETE /orders/{id}/fulfillment-orders/id/tracking-events/{id} 

**Important:** To maintain backwards compatibility, if Fulfillment Events are sent to the old endpoints, we will update the events of the first Fulfillment Order. This means that if the store does not manage stock in multiple locations, apps will continue to work without any issues. But, if the store manages its stock in multiple locations, apps can potentially set Fulfillment Events on the wrong Fulfillment Order.
**Important:** Statuses for fulfillment events in the new tracking events have not been added, updated or removed.

##### Shipping status changes

Since the Order can now have multiple fulfillments, we are going to add two values to `order.shipping_status`:

- `partially_packed`

- `partially_fulfilled`

In turn, each Fulfillment can have these statuses in `fulfillment_order.status`:

- `unpacked`: The fulfillment order was ready for packing. Same as in progress or fulfillment started.

- `packed`: The fulfillment order was packed, same as ready for sending.

- `ready_for_pickup`: The fulfillment order was ready for pickup, same as ready for pickup.

- `dispatched`: The fulfillment order was sent. Just for API.

- `marked_as_fulfilled`: The fulfillment order was sent. Just for Manual.

- `delivered`: The fulfillment order was fully fulfilled.

And now each `order.shipping_status` means the following:

- `unpacked`: If there is no Fulfillment Order with a `packed` status.

- `partially_packed`: If at least one Fulfillment Order reached `packed` status (but not all!) and none reached `dispatched`.

- `packed`: If all the Fulfillment Order reached `packed` status and none reached `dispatched`.

- `partially_fulfilled`: If at least one Fulfillment reached `dispatched` status.

- `fulfilled`: If all the Fulfillment Order reached `dispatched` status.

More details can be seen in the documentation for [Order](/api-documentation/resources/order) and [Fulfillment Order](/api-documentation/resources/fulfillment-order).

##### Changes in how to inform shipping status changes for the order

Shipping status on an Order now have to be informed on each Fulfillment Order.

| Endpoint (before) | Endpoint (now) 
| POST /orders/{id}/pack | PATCH /orders/{order_id}/fulfillment-orders/{fulfillment_order_id} 
| POST /orders/{id}/fulfill | PATCH /orders/{order_id}/fulfillment-orders/{fulfillment_order_id} 

The fulfillment order was packed

```
{ "status": "PACKED"}
```

The fulfillment order was sent

```
{ "status": "DISPATCHED", "tracking_info": { "code": "BR123123123AA", "url": "https://www.correios.com.br/BB123123123AA"}}
```

**Important:** To maintain backwards compatibility, if shipping status changes for the order are sent to the old endpoints, we will apply the changes only in the first Fulfillment Order. This means that if the store does not manage stock in multiple locations, apps will continue to work without any issues. But, if the store manages its stock in multiple locations, apps can potentially change the shipping status of the wrong Fulfillment Order.

##### Changes in invoices

An Order may have more than one invoice, so we will have a Metafield that holds a list of invoices. It's the responsbility of invoice producers to make sure this format is maintained when new invoices are added.

More details can be found [here](/api-documentation/resources/order#create-an-invoice).

##### New scopes

New `read_fulfillment_orders`/`write_fulfillment_orders` permissions are needed to be able to access endpoints with prefix `/orders/\{id\}/fulfillment-orders/\{id\}`.

**Important:** Apps will automatically receive the scope `read_fulfillment_orders` on all merchants' access_tokens if they have the read_orders scope. IDEM for `write_fulfillment_orders`.

## Integration guides

To simplify the adaptation process, we are going to create the following guides to migrate the most common use cases that we will complete as they are ready:

- [How to go from `variant.stock` to `variant.inventory_levels`](/api-documentation/guides/multi-inventory/products)

- [How to access the new information of the Order](/api-documentation/guides/multi-inventory/access-order)

- [How to adjust the creation of an order or draft order in a multi inventory environment](/api-documentation/guides/multi-inventory/create-order)

- [How to send Fulfillment Events](/api-documentation/resources/fulfillment-order#post-v1store_idordersorder_idfulfillment-ordersfulfillment_order_idtracking-events)

## What happens if I decide not to adapt?

Unfortunately, there are apps that, although they will not stop working when we launch the possibility of managing multi inventory stock, most likely will not work correctly for stores that have more than one location in their store.

Let's see the example of an application that reports the tracking codes of a shipment. Currently, the tracking code was sent in the `POST /orders/\{id\}/fulfill` payload. When we launch the possibility of managing multi inventory stock, the correct way to send the tracking code is going to be calling `POST /orders/\{id\}/fulfillment-orders/\{id\}/fulfill` sending the tracking code in the payload. As the order can potentially have multiple shipments, we need to know which shipment to associate the tracking code with. Let's imagine an order that has three shipments from three different locations and we receive `POST /orders/\{id\}/fulfill` with a tracking code, which shipment do we assign it to? For apps not to stop working, we have to assign it to one Fulfillment Order and we decided to assign it to the first one. If the store does not have multiple locations, it is not a problem because there can only be one shipment per sale. But if the order has more than one location, the tracking code sent to `POST /orders/\{id\}/fulfill` may have been intended to a fulfillment other than the first, causing confusion for both merchants and consumers.

This is why we decided to introduce the concept of "multi inventory ready" apps.

The conditions to be "multi inventory ready" is to meet any of the following requirements:

- Do not use any of these scopes:

read_products

- write_products

- read_orders

- write_orders

- read_draft_orders

- write_draft_orders

- read_shipping

- write_shipping

- Use any of the scopes above and:

Have passed an automatic approval of multi inventory.

- In the event that we so decide, pass a manual multi inventory approval.

Automatic approval requires that the application does not use deprecated endpoints or existing endpoints with deprecated parameters within the last 14 days.

Manual approval requires having passed the automatic approval and then passing a comprehensive re-approval — similar to the one carried out when the application was published — where we validate that the application is multi inventory ready.

The list of deprecated endpoints is:

- POST /orders/{id}/pack

- POST /orders/{id}/fulfill

- POST /orders/{id}/fulfillments

- GET /orders/{id}/fulfillments/{id}

- DELETE /orders/{id}/fulfillments/{id}

And the list of deprecated parameters of existing endpoints is:

| Endpoints | Parámetros 
| POST /productsPUT /products/{id}POST /products/{id}/variantsPUT /products/{id}/variants/{id}PATCH /products/{id}/variantsPOST /products/{id}/variants/stock | variant.stock 
| POST /orders/POST /draft_orders/ | shipping_carrier_nameshipping_tracking_numbershipping_tracking_urlshippingshipping_optionshipping_option_codeshipping_option_referenceshipping_pickup_detailsshipping_store_branch_nameshipping_pickup_typeshipping_suboption 

Knowing which apps are ”multi inventory ready”, we will give visibility to merchants in two key moments:

- When they are going to add their second location — i.e. turn on multi inventory location.

- If they already have more than one location and decide to install a new app.

In the first case, if there is an app installed that is not “multi inventory ready” we are going to give merchants visibility and ask them if they want to proceed adding the location or contact the developer of the app to make the necessary adjustments — this could mean that merchants decide to uninstall apps to be able to work with multi inventory stock.

In the second case, when installing the app we are going to give merchants visibility that the app is not "multi inventory ready" and let them decide if they want to proceed with the app install.

## How is the timeline for multi inventory stock

This is the timeline in which we plan to make the different deliveries available so that you can plan ahead.

| Deliverable | ETA 
| New Location endpoints | January 2023 
| Integration guides for specific use cases | February 2023 
| Mocks for new endpoints and paramenters | February 2023 
| Product y Product_Variant API compatibility for multi inventory stock | March 2023 
| Order API compatibility for multi inventory stock | March 2023 
| New Fulfillment Order endpoints | March 2023 
| Own internal tool to track automatic approval for apps | April 2023 

**Important:** These are all estimates and are subjected to changes. We'll keep this guide up to date to reflect the current estimation at all times.

## What are we adding in the future

After launching multi inventory stock we intend to add the following improvements:

- Webhooks for `Location` and `Inventory_Level`.

- Allow apps to subscribe to an endpoint to define where they want the stock for each order to come from before calculating shipping rates.

- `Location` object for layouts.