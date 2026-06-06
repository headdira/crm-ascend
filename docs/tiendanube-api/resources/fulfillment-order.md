---
title: Fulfillment Order
source: https://tiendanube.github.io/api-documentation/resources/fulfillment-order
version: 2025-03
---

# Fulfillment Order

An order can now have multiple shipments. Each shipment is described in a new entity called Fulfillment Order.

### Backward compatibility

Fulfillment Order keeps a backward compatibility with Order Shipping Information.
Compare the atributes from orders shipping to fulfillment orders.

#### Orders V1 to Fulfillment Orders

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
| order.shipping | fulfillment_order.shipping.carrier.carrier_id 
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

#### Orders Fulfillment Events V1 to Fulfillment Orders Tracking Events

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

***It's up to each application to define how the tracking address is represented as a string. The fulfillment event's city, province and country could be informed in fulfillment_order.tracking_events.address by concatenating all the information. Eg.: "Some street 31, Some City, Some State, Some Country".***

## Scopes

| Property | Explanation 
| read_fulfillment_orders | Allows you to read actions of one or more fulfillment orders for a merchant. 
| write_fulfillment_orders | Allows you to write actions of one or more fulfillment orders for a merchant. 

## Properties

### FulfillmentOrder

| Field Name | Field Type | Description 
| id | ID | The unique fulfillment order. (ULID) identification 
| number | String | The unique fulfillment order nice number by store 
| total_quantity | UnsignedInt | The Fulfillment order total line items quantity 
| total_weight | Decimal | The fulfillment order total line items weight 
| total_price | Money | The fulfillment order total line items price 
| assigned_location | FulfillmentOrderAssignedLocation | The fulfillment order assigned location 
| line_items | FulfillmentOrderLineItem[] | The fulfillment order line items 
| recipient | FulfillmentOrderRecipient | The fulfillment order recipient 
| shipping | FulfillmentOrderShipping | The fulfillment order shipping 
| destination | FulfillmentOrderDestination | The fulfillment order destination 
| discounts | FulfillmentOrderDiscount[] | The fulfillment order discounts 
| status | FulfillmentOrderStatus | The fulfillment order status 
| status_history | FulfillmentOrderStatusHistory[] | The fulfillment order status history. Default: []. 
| tracking_info | FulfillmentOrderTrackingInfo | The fulfillment order tracking info 
| tracking_info_history | FulfillmentOrderTrackingInfoHistory[] | The fulfillment order tracking info history. Default: [] 
| tracking_events | FulfillmentOrderTrackingEvent[] | The fulfillment order tracking events. Default: []. 
| fulfilled_at | DateTime | Date when the fulfillment order was sent in ISO 8601 format. Nullable. 
| created_at | DateTime | Date when the fulfillment order was last created in ISO 8601 format. 
| updated_at | DateTime | Date when the fulfillment order was last updated in ISO 8601 format. 

#### FulfillmentOrderAssignedLocation

| Field Name | Field Type | Description 
| location_id | ID | The fulfillment order assigned location identification 
| name | String | The fulfillment order assigned location name 
| address | Address | The fulfillment order assigned location address 

#### FulfillmentOrderLineItem

| Field Name | Field Type | Description 
| id | ID | The fulfillment order line item id 
| external_id | ID | The order external id 
| quantity | UnsignedInt | The fulfillment order line item quantity 
| variant | FulfillmentOrderLineItemVariant | The fulfillment order line item variant 
| product | FulfillmentOrderLineItemProduct | The fulfillment order line item product 
| unit_price | Money | The fulfillment order line item order line line unit price 
| unit_dimension | FulfillmentOrderLineItemDimension | The fulfillment order line item order line line unit dimension. 
| stock_transfer | FulfillmentOrderLineItemStockTransfer | The fulfillment order line item stock transfer information. Always present. 
| kit | FulfillmentOrderLineItemKit | The fulfillment order line item kit information. Nullable — `null` when the line item is not part of a kit. 
| custom_fields | Key-Value Dictionary | Dictionary with key-value pairs of the line item custom fields. Returned only when `aggregates` includes `custom_fields`. The key is the custom field name and the value is the custom field value. 
| created_at | DateTime | Date when the fulfillment order line item was last created in ISO 8601 format. 
| updated_at | DateTime | Date when the fulfillment order line item was last updated in ISO 8601 format. 

##### FulfillmentOrderLineItemVariant

| Field Name | Field Type | Description 
| variant_id | ID | The fulfillment order line item variant identification. 

##### FulfillmentOrderLineItemProduct

| Field Name | Field Type | Description 
| product_id | ID | The fulfillment order line item product identification. 

##### FulfillmentOrderLineItemDimension

| Field Name | Field Type | Description 
| weight | Decimal | The fulfillment order line item dimension weight. 
| width | Decimal | The fulfillment order line item dimension width. 
| height | Decimal | The fulfillment order line item dimension height. 
| depth | Decimal | The fulfillment order line item dimension depth. 

##### FulfillmentOrderLineItemStockTransfer

| Field Name | Field Type | Description 
| from_location_id | String | The location identifier where the stock is being transferred from. Nullable — `null` when the line item is not part of a stock transfer. 

##### FulfillmentOrderLineItemKit

| Field Name | Field Type | Description 
| catalog_kit_id | String | The catalog kit identifier the line item belongs to. Must be sent together with `order_kit_id`. 
| order_kit_id | String | The order kit identifier the line item belongs to. Must be sent together with `catalog_kit_id`. 

#### FulfillmentOrderRecipient

| Field Name | Field Type | Description 
| name | String | The fulfillment order recipient name. 
| phone | String | The fulfillment order recipient phone. Optional 
| identifier | String | The fulfillment order recipient identifier. Optional. 

#### FulfillmentOrderShipping

| Field Name | Field Type | Description 
| type | FulfillmentOrderShippingType | The fulfillment order shipping type. 
| carrier | Carrier | The fulfillment order shipping carrier. 
| option | Option | The fulfillment order shipping option. 
| merchant_cost | Money | The fulfillment merchant shipping option cost. 
| consumer_cost | Money | The fulfillment consumer shipping option cost. 
| min_delivery_date | DateTime | The fulfillment minimum estimated delivery date. Nullable. 
| max_delivery_date | DateTime | The fulfillment maximum estimated delivery date. Nullable. 
| estimated_delivery_time | FulfillmentOrderEstimatedDeliveryTime | The fulfillment order estimated delivery time with the detailed breakdown of days that compose the min/max delivery dates. Nullable. 
| pickup_details | FulfillmentOrderShippingPickupDetails | The fulfillment order shipping pickup details. Nullable. 
| extras | FulfillmentOrderShippingExtraProperty | The fulfillment order shipping extra properties. Eg. {"free_shipping_id": "123456"}. Nullable. 

##### FulfillmentOrderShippingType

| Type | Description 
| pickup | The fulfillment order shipping type for pickup point shipping options 
| ship | The fulfillment order shipping type for ship shipping options 
| non-shippable | The fulfillment order shipping type for non shippable 

##### FulfillmentOrderEstimatedDeliveryTime

| Field Name | Field Type | Description 
| min | FulfillmentOrderEstimatedDeliveryTimeBase | The minimum estimated delivery time breakdown. Nullable. 
| max | FulfillmentOrderEstimatedDeliveryTimeBase | The maximum estimated delivery time breakdown. Nullable. 

###### FulfillmentOrderEstimatedDeliveryTimeBase

| Field Name | Field Type | Description 
| days | UnsignedInt | The total estimated delivery days, including non-business days. 
| business_days | UnsignedInt | The total estimated delivery business days. 
| date | DateTime | The estimated delivery date in ISO 8601 format. Nullable. 
| aggregate_days | FulfillmentOrderAggregateDaysBase | The detailed breakdown of how the delivery days are composed. Nullable. 

###### FulfillmentOrderAggregateDaysBase

| Field Name | Field Type | Description 
| by_product_handling_days | UnsignedInt | Days added by product handling time. 
| by_transfer_handling_days | UnsignedInt | Days added by stock transfer handling between locations. 
| by_dc_preparation_days | UnsignedInt | Days added by distribution center preparation time. 
| by_dc_non_working_days_skipped | UnsignedInt | Non-working days skipped at the distribution center. 
| by_carrier_pickup_days_and_times_of_cuts | UnsignedInt | Days added by carrier pickup schedules and cut-off times. 
| by_carriers_original_estimated_days | UnsignedInt | Carrier's original estimated delivery days. 
| by_carriers_additional_days | UnsignedInt | Additional days added on top of the carrier's original estimate. 
| by_carrier_non_working_days_skipped | UnsignedInt | Non-working days skipped by the carrier. 

##### FulfillmentOrderShippingPickupDetails

| Field Name | Field Type | Description 
| location_id | String | The fulfillment order shipping pickup detail identification. Ex.: Location ID, IdCentroImposicion (OCA). 
| store_branch_id | String | The fulfillment order shipping pickup detail identification for store_branch_id. This field will be deprecated with store branch features in the future. 
| name | String | The fulfillment order shipping pickup details name 
| address | Address | The fulfillment order shipping pickup details pickup point address 
| pickup_hours | FulfillmentOrderPickupHour[] | The fulfillment order shipping pickup details pickup hours. Default: [] 

###### FulfillmentOrderPickupHour

| Field Name | Field Type | Description 
| day | FulfillmentOrderPickupHourWeekday | The fulfillment order shipping pickup detail pickup the weekday. Eg.: MONDAY. 
| start | String | The fulfillment order shipping pickup detail pickup hour the start hour. Eg.: 0800 
| end | String | The fulfillment order shipping pickup detail pickup hour the end hour. Eg.: 1800 

##### FulfillmentOrderShippingExtraProperty

| Field Name | Field Type | Description 
| free_shipping_info | FreeShippingInfo | The shipping extra property for free shipping information. 
| phone_required | Boolean | The shipping option requires a consumer phone number flag indicator. 
| id_required | Boolean | The shipping option requires a consumer document number flag indicator. 
| accepts_cod | Boolean | The shipping option accepts cash on delivery flag indicator. 
| show_time | Boolean | The shipping option must show the estimated delivery time flag indicator. 
| shippable | Boolean | The shipping option is shippable, meaning the package will be sent to the consumer or to the pickup point. 

###### FreeShippingInfo

| Field Name | Field Type | Description 
| free_shipping_id | ID | The fulfillment order shipping free shipping info free shipping identification. 
| consumer_original_cost | Money | The fulfillment order shipping the consumer original cost, without applying the free shipping rules. 

###### FulfillmentOrderPickupHourWeekday

| Type | Description 
| MONDAY | The fulfillment order pickup hour weekday constant for monday. 
| TUESDAY | The fulfillment order pickup hour weekday constant for tuesday. 
| WEDNESDAY | The fulfillment order pickup hour weekday constant for wednesday. 
| THURSDAY | The fulfillment order pickup hour weekday constant for thursday. 
| FRIDAY | The fulfillment order pickup hour weekday constant for friday. 
| SATURDAY | The fulfillment order pickup hour weekday constant for saturday. 
| SUNDAY | The fulfillment order pickup hour weekday constant for sunday. 

#### FulfillmentOrderRecipient

| Field Name | Field Type | Description 
| name | String | The fulfillment order recipient name. 
| phone | String | The fulfillment order recipient phone. Optional 
| identifier | String | The fulfillment order recipient identifier. Optional. 

#### FulfillmentOrderDiscount

| Field Name | Field Type | Description 
| type | FulfillmentOrderDiscountType | The discount type. 
| amount | Money | The fulfillment order discount amount. 

###### FulfillmentOrderDiscountType

| Type | Description 
| SHIPPING | The fulfillment order discount by shipping. 
| PROMOTION | The fulfillment order discount by promotion. 
| PAYMENT_METHOD | The fulfillment order discount by payment. 
| TOTAL_OF_DISCOUNTS | The fulfillment order total discounts. 

#### FulfillmentOrderDestination

| Field Name | Field Type | Description 
| zipcode | String | The address zipcode. Optional. 
| street | String | The address street. 
| number | String | The address number. Optional. 
| floor | String | The address floor. Brazil's complement. Optional. 
| locality | String | The address locality. Brazil's neighborhood. Optional. 
| city | String | The address city name. Optional. 
| reference | String | The address reference. Optional. 
| between_streets | String | The address between streets. Optional. 
| province | Province | The address province. Optional. 
| region | Region | The address Region. Optional. 
| country | Country | The address Country. Optional. 

#### FulfillmentOrderStatus

| Type | Description 
| UNPACKED | The fulfillment initial state, same as not started. 
| PACKED | The fulfillment order was packed, same as ready for sending. 
| DISPATCHED | The fulfillment order was sent. 
| READY_FOR_PICKUP | The fulfillment order was ready for pickup. 
| DELIVERED | The fulfillment order was fully fulfilled. 

##### Workflow

The Fulfillment Order Status Workflow has some validations by Fulfillment Order Shipping Type.

Below are the diagrams indicating the expected flows.

- *The solid lines indicate indicates the most common and expected workflow.*

- *The dotted lines indicate the alternative allowed workflows.*

- *Depending on the fulfillment order's shipping type, certain flows are not applicable. For example, the `READY_FOR_PICKUP` status applies only to the pickup Shipping Type, while `non-shippable` Shipping Types expect only the `DELIVERED` status.*

- *It is possible to go back to `UNPACKED` only from `PACKED` status.*

> **Warning:** To update the fulfillment order status to `DELIVERED`, the preferred approach is through **creating or updating tracking events** with status `delivered`. When the system receives a tracking event with status `delivered` (via POST or PUT), it automatically updates the fulfillment order to `DELIVERED` and sets `fulfilled_at` to the `happened_at` date of that tracking event. Prefer this flow over setting status to `DELIVERED` directly via PATCH on the fulfillment order.

###### FulfillmentOrderShippingType as 'ship'

*Fulfillment Orders with Shipping Type `ship` are used for shipping physical products directly to the consumer's home. Ex.: Shipping a t-shirt.*

###### FulfillmentOrderShippingType as 'pickup'

*Fulfillment Orders with Shipping Type `pickup` are used for shipping physical products directly to a pickup point. Ex.: Shipping a t-shirt.*

###### FulfillmentOrderShippingType as 'non-shippable'

*Fulfillment Orders with Shipping Type `non-shippable` are used for shipments of non-physical products to the consumer. Ex: classes sent to the consumer's email.*

#### FulfillmentOrderStatusHistory

| Field Name | Field Type | Description 
| from_status | FulfillmentOrderStatus | The fulfillment order from status. Nullable. 
| to_status | FulfillmentOrderStatus | The fulfillment order to status. Nullable. 
| happened_at | DateTime | Date when the fulfillment order history was happened in ISO 8601 format. 
| created_at | DateTime | Date when the fulfillment order history was created in ISO 8601 format. 

#### FulfillmentOrderTrackingInfo

| Field Name | Field Type | Description 
| url | String | The fulfillment order tracking info url. Nullable. 
| code | String | The fulfillment order tracking info code. Nullable. 

#### FulfillmentOrderTrackingInfoHistory

| Field Name | Field Type | Description 
| from_tracking_info | FulfillmentOrderTrackingInfo | The fulfillment order from tracking info. Nullable. 
| to_tracking_info | FulfillmentOrderTrackingInfo | The fulfillment order to tracking info. Nullable. 
| happened_at | DateTime | Date when the fulfillment order history was happened in ISO 8601 format. 
| created_at | DateTime | Date when the fulfillment order history was created in ISO 8601 format. 
| app_id | String | App ID of the app who made this change. 
| user_id | String | User ID of the person who made this change. 

#### FulfillmentOrderTrackingEvent

| Field Name | Field Type | Description 
| id | ID | The fulfillment order tracking event identification. (ULID) 
| status | FulfillmentOrderTrackingEventStatus | The fulfillment order tracking event status. 
| description | String | The fulfillment order tracking event description. 
| address | String | The fulfillment order tracking event address information. Eg.: "St. Paul 123 - Ciudad - AR 1298". Nullable. 
| geolocation | FulfillmentOrderTrackingEventGeolocation | The fulfillment order tracking event geolocation. Nullable. 
| happened_at | DateTime | Date when the fulfillment order tracking event happened in ISO 8601 format. If **Null** Assumed **NOW** 
| estimated_delivery_at | DateTime | Date when the fulfillment order tracking event estimated delivery at in ISO 8601 format. Nullable. 
| created_at | DateTime | Date when the fulfillment order tracking event was created in ISO 8601 format. 
| updated_at | DateTime | Date when the fulfillment order tracking event was updated in ISO 8601 format. 

##### FulfillmentOrderTrackingEventStatus

| Type | Description 
| dispatched | Package has been posted by the merchant. 
| received_by_post_office | Package has been received by the Shipping Carrier. 
| in_transit | Package is in transit. 
| out_for_delivery | Package is out for delivery. 
| delivery_attempt_failed | Package could not be delivered. 
| delayed | Package delayed. 
| ready_for_pickup | Package is ready for pickup. 
| delivered | Package was delivered. 
| returned_to_sender | Package was returned to the sender. 
| lost | Package lost. 
| failure | Package delivery failed. 
| custom_**{status}** | Package any custom status informed by a shipping partner. 

##### FulfillmentOrderTrackingEventGeolocation

| Field Name | Field Type | Description 
| longitude | Decimal | The fulfillment order tracking event geolocation longitude. 
| latitude | Decimal | The fulfillment order tracking event geolocation latitude. 

##### Money

| Field Name | Field Type | Description 
| value | Decimal | The amount value 
| currency | String | The isocode currency code 

##### Carrier

| Field Name | Field Type | Description 
| carrier_id | String | The carrier identification. It could be alphanumeric identification like current shipping native methods or shipping carrier id identification. 
| code | CarrierCodeType | The carrier code type. 
| name | String | The carrier name. 
| app_id | String | The carrier application identification. Default: `null`. 

###### CarrierCodeType

| Type | Description 
| api | The shipping carrier is a shipping method from carriers API. 
| custom | The shipping carrier is a shipping method from customs configured by merchant. 
| locale | The shipping carrier is a shipping method from locales (branchs) configured by merchant. 
| international | The shipping carrier is a shipping from international customs configured by merchant. 
| native | The shipping carrier is a shipping from a internal integration created by Nuvemshop/Tiendanube and configured by merchant. 
| draft | The shipping carrier is a shipping from draft orders. 
| default | The shipping carrier is a shipping from default orders. 

##### Option

| Field Name | Field Type | Description 
| name | String | The option name. 
| code | String | The option code. 
| reference | String | The option reference. 
| allow_free_shipping | Boolean | The option allows a free shipping flag indicator. Default: null. 

##### Address

| Field Name | Field Type | Description 
| zipcode | String | The address zipcode. Optional. 
| street | String | The address street. 
| number | String | The address number. Optional. 
| floor | String | The address floor. Brazil's complement. Optional. 
| locality | String | The address locality. Brazil's neighborhood. Optional. 
| city | String | The address city name. Optional. 
| reference | String | The address reference. Optional. 
| between_streets | String | The address between streets. Optional. 
| province | Province | The address province. Optional. 
| region | Region | The address Region. Optional. 
| country | Country | The address Country. Optional. 

###### Provice

| Field Name | Field Type | Description 
| name | String | The province name. 
| code | String | The province code. 

###### Region

| Field Name | Field Type | Description 
| name | String | The region name. 
| code | String | The region code. 

###### Country

| Field Name | Field Type | Description 
| name | String | The country name. 
| code | String | The country code. 

### FulfillmentOrderPaginated

| Field Name | Field Type | Description 
| total | UnsignedInt | Total of FulfillmentOrder. 
| page | UnsignedInt | Current page. 
| per_page | UnsignedInt | Quantity of FulfillmentOrder per page. 
| results | FulfillmentOrder[] | List of fulfillment orders. 

### Error

| Field Name | Field Type | Description 
| description | String | Http status description. 
| message | String | Error Message. 

### Validation

| Field Name | Field Type | Description 
| description | String | Http status description. 
| messages | Message[] | List of inputs validation messages. 

#### Message

| Type | Description 
| String[] | The error message input. This value is dynamic. Eg.: "shipping.carrier.carrier_id": ["should not be empty", "must be a string"]. 

## Input Request Properties

### FulfillmentOrderInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| assigned_location | FulfillmentOrderAssignedLocationInput | ✅ | ❌ | The fulfillment order assigned location. 
| line_items | FulfillmentOrderLineItemInput[] | ✅ | ❌ | The fulfillment order line item input list. 
| recipient | FulfillmentOrderRecipientInput | ✅ | ❌ | The fulfillment order recipient input. 
| destination | FulfillmentOrderDestinationInput | ✅ | ✅ | The fulfillment order destination input. 
| shipping | FulfillmentOrderShippingInput | ✅ | ✅ | The fulfillment order shipping input. 

#### FulfillmentOrderAssignedLocationInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| id | ID | ✅ | ❌ | The fulfillment order assigned location input identification. (ULID) 

#### FulfillmentOrderLineItemInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| quantity | UnsignedInt | ✅ | ❌ | The fulfillment order line item input quantity. 
| order_line_item_id | ID | ✅ | ❌ | The order line item identification reference. 

#### FulfillmentOrderRecipientInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| name | String | ✅ | ❌ | The fulfillment order recipient input name. 
| phone | String | ✅ | ✅ | The fulfillment order recipient input phone. 
| identifier | String | ✅ | ✅ | The fulfillment order recipient input identifier. 

#### FulfillmentOrderShippingInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| type | FulfillmentOrderShippingType | ✅ | ❌ | The fulfillment order shipping type. Eg.: pickup, ship. 
| carrier | CarrierInput | ✅ | ✅ | The fulfillment order shipping carrier input. 
| option | OptionInput | ✅ | ✅ | The fulfillment order shipping option input. 
| merchant_cost | MoneyInput | ✅ | ❌ | The fulfillment order merchant shipping cost. 
| consumer_cost | MoneyInput | ✅ | ❌ | The fulfillment order consumer shipping cost. 
| min_delivery_date | DateTime | ✅ | ✅ | The fulfillment order shipping min delivery date. 
| max_delivery_date | DateTime | ✅ | ✅ | The fulfillment order shipping max delivery date. 
| pickup_details | PickupDetailsInput | ✅ | ✅ | The fulfillment order shipping pickup details. 

##### CarrierInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| id | String | ✅ | ❌ | The shipping carrier input identification. Eg.: "1234", "correios", "oca". 
| code | CarrierCodeTypeInput | ✅ | ❌ | The shipping carrier input type. 
| app_id | String | ❌ | ✅ | The shipping carrier application identification. Default: `null` 

###### CarrierCodeTypeInput

| Type | Description 
| api | The shipping carrier is a shipping method from carriers API. 
| custom | The shipping carrier is a shipping method from customs configured by merchant. 
| locale | The shipping carrier is a shipping method from locales (branchs) configured by merchant. 
| international | The shipping carrier is a shipping from international customs configured by merchant. 
| native | The shipping carrier is a shipping from a internal integration created by Nuvemshop/Tiendanube and configured by merchant. 
| draft | The shipping carrier is a shipping from draft orders. 
| default | The shipping carrier is a shipping from default orders. 

##### OptionInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| code | String | ✅ | ❌ | The shipping option input code. Eg.: "pac", "sedex". 
| reference | String | ✅ | ✅ | The shipping option input reference. 
| allow_free_shipping | String | ❌ | ✅ | The shipping option input allows free shipping flag indicator. Default: false. 

##### PickupDetailsInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| location_id | String | ✅ | ❌ | The shipping pickup details input identification. 
| name | String | ✅ | ❌ | The shipping pickup details input name. 
| address | AddreeInput | ✅ | ❌ | The shipping pickup details input address. 
| pickup_hours | PickupHourInput[] | ❌ | ❌ | The shipping pickup details input pickup hours. Default: []. 

###### PickupHourInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| day | FulfillmentOrderPickupHourWeekday | ✅ | ❌ | The fulfillment order shipping pickup details the weekday. Eg.: MONDAY 
| start | String | ✅ | ❌ | The fulfillment order shipping pickup detail pickup hour the start hour. Eg.: 0800 
| end | String | ✅ | ❌ | The fulfillment order shipping pickup detail pickup hour the end hour. Eg.: 1800 

##### ExtraPropertyInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| free_shipping_info | FreeShippingInput | ❌ | ❌ | The shipping extra property input for free shipping information. 
| phone_required | Boolean | ❌ | ❌ | The shipping option requires a consumer phone number flag indicator. 
| id_required | Boolean | ❌ | ❌ | The shipping option requires a consumer document number flag indicator. 
| accepts_cod | Boolean | ❌ | ❌ | The shipping option accepts cash on delivery flag indicator. 
| show_time | Boolean | ❌ | ❌ | The shipping option must show the estimated delivery time flag indicator. 
| shippable | Boolean | ❌ | ❌ | The shipping option is shippable, meaning the package will be sent to the consumer or to the pickup point. 

###### FreeShippingInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| free_shipping_id | ID | ✅ | ❌ | The shipping free shipping info input free shipping identification input. 
| consumer_original_cost | Money | ✅ | ❌ | The shipping free shipping info input the consumer original shipping cost. 

#### FulfillmentOrderDestinationInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| zipcode | String | ✅ | ✅ | The fulfillment order destination input zipcode. 
| street | String | ✅ | ❌ | The fulfillment order destination input street. 
| number | String | ✅ | ✅ | The fulfillment order destination input number. 
| floor | String | ✅ | ✅ | The fulfillment order destination input floor. 
| locality | String | ✅ | ✅ | The fulfillment order destination input locality. 
| city | String | ✅ | ✅ | The fulfillment order destination input city name. 
| reference | String | ✅ | ✅ | The fulfillment order destination input reference. 
| between_streets | String | ✅ | ✅ | The fulfillment order destination input between streets. 
| province | ProvinceInput | ✅ | ✅ | The fulfillment order destination input province. 
| region | RegionInput | ✅ | ✅ | The fulfillment order destination input region. 
| country | CountryInput | ✅ | ❌ | The fulfillment order destination input country. 

#### FulfillmentOrderStatusInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| status | FulfillmentOrderStatus | ✅ | ❌ | The fulfillment order status input status. 

#### FulfillmentOrderTrackingInfoInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| code | String | ✅ | ✅ | The fulfillment order tracking info input tracking number. 
| url | String | ✅ | ✅ | The fulfillment order tracking info input tracking number. 
| notify_customer | Boolean | ✅ | ❌ | Notify the customer about the fulfillment (the default value is false) 

#### FulfillmentOrderTrackingEventInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| status | FulfillmentOrderTrackingEventStatus | ✅ | ❌ | The fulfillment order tracking event input status. 
| description | String | ✅ | ❌ | The fulfillment order tracking event input description. 
| address | String | ✅ | ✅ | The fulfillment order tracking event input address as one liner address. Ex: St. Julio 123, Ciudad, Argentina. 
| geolocation | FulfillmentOrderTrackingEventGeolocationInput | ✅ | ✅ | The fulfillment order tracking event geolocation input. 
| happened_at | DateTime | ✅ | ✅ | The fulfillment order tracking event input happened at the event. If null, the event was taken as now. 
| estimated_delivery_at | DateTime | ✅ | ✅ | The fulfillment order tracking event input estimated delivery date time to arrive. 

##### FulfillmentOrderTrackingEventGeolocationInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| latitude | Decimal | ✅ | ❌ | The fulfillment order tracking event geolocation latitude input. 
| longitude | Decimal |   ✅ | ❌ | The fulfillment order tracking event geolocation longitude input. 

##### MoneyInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| value | Decimal | ✅ | ❌ | The money input value. 
| currency | String | ✅ | ❌ | The money input currency isocode. Eg.: ARS, BRL. 

##### AddressInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| zipcode | String | ✅ | ✅ | The fulfillment order address input zipcode. 
| street | String | ✅ | ✅ | The fulfillment order address input street. 
| number | String | ✅ | ✅ | The fulfillment order address input number. 
| floor | String | ✅ | ✅ | The fulfillment order address input floor. 
| locality | String | ✅ | ✅ | The fulfillment order address input locality. 
| city | String | ✅ | ✅ | The fulfillment order address input city name. 
| reference | String | ✅ | ✅ | The fulfillment order address input reference. 
| between_streets | String | ✅ | ✅ | The fulfillment order address input between streets. 
| province | ProvinceInput | ✅ | ✅ | The fulfillment order address input province. 
| region | RegionInput | ✅ | ✅ | The fulfillment order address input region. 
| country | CountryInput | ✅ | ✅ | The fulfillment order address input country. 

###### ProvinceInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| name | String | ✅ | ❌ | The province input name. 
| code | String | ✅ | ❌ | The province input code. 

###### RegionInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| name | String | ✅ | ❌ | The region input name. 
| code | String | ✅ | ❌ | The region input code. 

###### CountryInput

| Field Name | Field Type | Mandatory | Nullable | Description 
| name | String | ✅ | ❌ | The country input name. 
| code | String | ✅ | ❌ | The country input code. 

## Endpoints

### GET /orders/{order_id}/fulfillment-orders

Retrive all Order Fulfillments from a specific Order.

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Parameters

| Parameter | Explanation 
| aggregates | One possible value: `custom_fields`. Enables a `custom_fields` dictionary inside each FulfillmentOrder line item with the line item custom fields information. 

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrder[] | The List of Fulfillment Orders Response. 

###### GET /orders/123456/fulfillment-orders

```
[ { "id": "01FHZXHK8PTP9FVK99Z66GXKKK", "number": "123456", "total_quantity": 12, "total_weight": 12.12, "total_price": { "value": 123.45, "currency": "BRL" }, "assigned_location": { "location_id": "01FHZXHK8PTP9FVK99Z66GXQTX", "name": "Location name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP", "name": "São Paulo" }, "region": { "code": "SE", "name": "Sudeste" }, "country": { "code": "BR", "name": "Brasil" } } }, "line_items": [ { "id": "01J1QCWJXGNX56JP0NCBS0G711", "external_id": "123", "quantity": 1, "variant": { "variant_id": "12345678" }, "product": { "product_id": "12345678" }, "unit_price": { "value": 123.45, "currency": "BRL" }, "unit_dimension": { "weight": 1.23456, "width": 12.34567, "height": 12.34567, "depth": 12.34567 }, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" } ], "recipient": { "name": "Recipient name", "phone": "11988864311", "identifier": "11223344B" }, "shipping": { "type": "pickup|ship", "carrier": { "name": "Some Carrier Name", "carrier_id": "12345", "code": "api", "app_id": "12345" }, "option": { "name": "Some Option Name", "code": "some-option-code", "reference": "some-option-ref", "allow_free_shipping": true }, "merchant_cost": { "value": 123.14, "currency": "BRL" }, "consumer_cost": { "value": 123.14, "currency": "BRL" }, "min_delivery_date": "2022-11-24T10:20:19+00:00", "max_delivery_date": "2022-11-25T10:20:19+00:00", "pickup_details": { "location_id": "pickup-option-id", "name": "Some option pickup detail name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "pickup_hours": [ { "day": "MONDAY", "start": "0800", "end": "1800" } ] }, "extras": { "free_shipping_info": { "free_shipping_id": "1234567", "consumer_original_cost": { "value": 12.34, "currency": "BRL" } }, "phone_required": true, "id_required": true, "accepts_cod": true, "show_time": true, "shippable": true } }, "discounts": [ { "type": "TOTAL_OF_DISCOUNTS", "amount": { "value": 20, "currency": "BRL" } } ], "destination": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "status": "PACKED", "status_history": [ { "from_status": "UNPACKED", "to_status": "PACKED", "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00" } ], "tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "tracking_info_history": [ { "from_tracking_info": { "url": null, "code": null }, "to_tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T11:29:57.742Z", "app_id": "1", "user_id": "1" } ], "tracking_events": [ { "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Poul 123, Ciudad - Argentina 1290", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" } ], "fulfilled_at": null, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" }]
```

###### GET /orders/123456/fulfillment-orders?aggregates=custom_fields

```
[ { "id": "01FHZXHK8PTP9FVK99Z66GXKKK", "number": "123456", "total_quantity": 12, "total_weight": 12.12, "total_price": { "value": 123.45, "currency": "BRL" }, "assigned_location": { "location_id": "01FHZXHK8PTP9FVK99Z66GXQTX", "name": "Location name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP", "name": "São Paulo" }, "region": { "code": "SE", "name": "Sudeste" }, "country": { "code": "BR", "name": "Brasil" } } }, "line_items": [ { "id": "01J1QCWJXGNX56JP0NCBS0G711", "external_id": "123", "quantity": 1, "variant": { "variant_id": "12345678" }, "product": { "product_id": "12345678" }, "unit_price": { "value": 123.45, "currency": "BRL" }, "unit_dimension": { "weight": 1.23456, "width": 12.34567, "height": 12.34567, "depth": 12.34567 }, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00", "custom_fields": { "nombre": "John Doe", "my_custom_field": "my_custom_value" } } ], "recipient": { "name": "Recipient name", "phone": "11988864311", "identifier": "11223344B" }, "shipping": { "type": "pickup|ship", "carrier": { "name": "Some Carrier Name", "carrier_id": "12345", "code": "api", "app_id": "12345" }, "option": { "name": "Some Option Name", "code": "some-option-code", "reference": "some-option-ref", "allow_free_shipping": true }, "merchant_cost": { "value": 123.14, "currency": "BRL" }, "consumer_cost": { "value": 123.14, "currency": "BRL" }, "min_delivery_date": "2022-11-24T10:20:19+00:00", "max_delivery_date": "2022-11-25T10:20:19+00:00", "pickup_details": { "location_id": "pickup-option-id", "name": "Some option pickup detail name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "pickup_hours": [ { "day": "MONDAY", "start": "0800", "end": "1800" } ] }, "extras": { "free_shipping_info": { "free_shipping_id": "1234567", "consumer_original_cost": { "value": 12.34, "currency": "BRL" } }, "phone_required": true, "id_required": true, "accepts_cod": true, "show_time": true, "shippable": true } }, "discounts": [ { "type": "TOTAL_OF_DISCOUNTS", "amount": { "value": 20, "currency": "BRL" } } ], "destination": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "status": "PACKED", "status_history": [ { "from_status": "UNPACKED", "to_status": "PACKED", "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00" } ], "tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "tracking_info_history": [ { "from_tracking_info": { "url": null, "code": null }, "to_tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T11:29:57.742Z", "app_id": "1", "user_id": "1" } ], "tracking_events": [ { "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Poul 123, Ciudad - Argentina 1290", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" } ], "fulfilled_at": null, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" }]
```

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Error Response 

### GET /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}

Get a Fulfillment Order By Identifier

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrder | The Fulfillment Order Response. 

###### GET /orders/123456/fulfillment-orders/01FHZXHK8PTP9FVK99Z66GXASS

```
{ "id": "01FHZXHK8PTP9FVK99Z66GXASS", "number": "123456", "total_quantity": 12, "total_weight": 12.12, "total_price": { "value": 123.45, "currency": "BRL" }, "assigned_location": { "location_id": "01FHZXHK8PTP9FVK99Z66GXQTX", "name": "Location name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP", "name": "São Paulo" }, "region": { "code": "SE", "name": "Sudeste" }, "country": { "code": "BR", "name": "Brasil" } } }, "line_items": [ { "quantity": 1, "variant": { "variant_id": "12345678" }, "product": { "product_id": "12345678" }, "unit_price": { "value": 123.45, "currency": "BRL" }, "unit_dimension": { "weight": 1.23456, "width": 12.34567, "height": 12.34567, "depth": 12.34567 }, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" } ], "recipient": { "name": "Recipient name", "phone": "11988864311", "identifier": "11223344B", "allow_free_shipping": false }, "shipping": { "type": "pickup|ship", "carrier": { "name": "Some Carrier Name", "code": "api", "carrier_id": "12345", "app_id": "12345" }, "option": { "name": "Some Option Name", "code": "some-option-code", "reference": "some-option-ref" }, "merchant_cost": { "value": 123.14, "currency": "BRL" }, "consumer_cost": { "value": 123.14, "currency": "BRL" }, "min_delivery_date": "2022-11-24T10:20:19+00:00", "max_delivery_date": "2022-11-25T10:20:19+00:00", "pickup_details": { "location_id": "pickup-option-id", "name": "Some option pickup detail name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "pickup_hours": [ { "day": "MONDAY", "start": "0800", "end": "1800" } ], "extras": { "free_shipping_info": { "free_shipping_id": "1234567", "consumer_original_cost": { "value": 12.34, "currency": "BRL" } }, "phone_required": true, "id_required": true, "accepts_cod": true, "show_time": true, "shippable": true } } }, "destination": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" } }, "status": "PACKED", "status_history": [ { "from_status": "UNPACKED", "to_status": "PACKED", "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00" } ], "tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "tracking_info_history": [ { "from_tracking_info": { "url": null, "code": null }, "to_tracking_info": { "url": "https://tracking-url.com", "code": "BDJ9999" }, "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T11:29:57.742Z", "app_id": "1", "user_id": "1" } ], "tracking_events": [ { "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Paul 123, Ciudad - Argentina 1290", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" } ], "fulfilled_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00"}
```

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Error Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order Error Response 

### DELETE /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}

Delete Fulfillment Order By Identifier

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Responses

##### HTTP 204 - No Content

###### DELETE /orders/123456/fulfillment-orders/01FHZXHK8PTP9FVK99Z66GXASS

##### HTTP 400 - Bad Request

| Type | Description 
| Error | The Fulfillment Order Delete Error Response 

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Error Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order Error Response 

### PATCH /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}

Update Fulfillment Order Status, Tracking Info, Destination, Recipient, Shipping, Assigned Location

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Notes

- Parameters are sent in body, JSON format

- FulfillmentOrderStatusInput or and FulfillmentOrderTrackingInfoInput or and FulfillmentOrderDestinationInput or and FulfillmentOrderShippingInput or and FulfillmentOrderRecipientInput or and FulfillmentOrderAssignedLocationInput

- Fulfillment Order Already sent Cannot be Update Destination Information

- Fulfillment Order Already sent Cannot be Update Shipping Information

- Fulfillment Order Already sent Cannot be Update Recipient Information

- Fulfillment Order Already packed or sent Cannot be Update Assigned Location Information

- If the status is DELIVERED, the fulfillment order will be marked as fulfilled. This means the fulfilled_at field will be filled with the current date and time.

#### Request Payload

| Type | Description 
| FulfillmentOrderInput | The Fulfillment Order Input. 

```
{ "status": "PACKED", "tracking_info": { "code": "BR123123123AA", "url": "https://www.correios.com.br/BB123123123AA", "notify_customer": true }, "destination": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP" }, "region": { "code": "SP" }, "country": { "code": "BR" } }, "shipping": { "type": "pickup|ship", "carrier": { "carrier_id": "12345", "code": "api", "app_id": "12345" }, "option": { "code": "some-option-code", "reference": "some-option-ref", "allow_free_shipping": true }, "merchant_cost": { "value": 123.14, "currency": "BRL" }, "consumer_cost": { "value": 123.14, "currency": "BRL" }, "min_delivery_date": "2022-11-24T10:20:19+00:00", "max_delivery_date": "2022-11-25T10:20:19+00:00", "pickup_details": { "location_id": "pickup-option-id", "name": "Some option pickup detail name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP" }, "region": { "code": "SE" }, "country": { "code": "BR" } }, "pickup_hours": [ { "day": "MONDAY", "start": "0800", "end": "1800" } ] }, "extras": { "free_shipping_info": { "free_shipping_id": "1234567", "consumer_original_cost": { "value": 12.34, "currency": "BRL" } }, "phone_required": true, "id_required": true, "accepts_cod": true, "show_time": true, "shippable": true } }, "recipient": { "name": "Some Name", "phone": "11988864311", "identifier": "44112233" }, "assigned_location": { "location_id": "01ARZ3NDEKTSV4RRFFQ69G5DAD" }}
```

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrder | The Fulfillment Order Response. 

###### PATCH /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV

```
{ "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV", "number": "123456", "status": "PACKED", "status_history": [ { "from_status": "UNPACKED", "to_status": "PACKED", "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00" } ], "fulfilled_at": "2022-11-24T10:20:19+00:00", "tracking_info": { "code": "BR123123123AA", "url": "https://www.correios.com.br/BB123123123AA", "notify_customer": true }, "tracking_info_history": [ { "from_tracking_info": { "url": null, "code": null }, "to_tracking_info": { "code": "BR123123123AA", "url": "https://www.correios.com.br/BB123123123AA", }, "happened_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T11:29:57.742Z", "app_id": "1", "user_id": "1" } ], "destination": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "name": "São Paulo", "code": "SP" }, "region": { "name": "Sudeste", "code": "SE" }, "country": { "name": "Brasil", "code": "BR" }, }, "shipping": { "type": "pickup|ship", "carrier": { "carrier_id": "12345", "code": "api", "name": "Same Carrier Name", "app_id": "12345" }, "option": { "code": "some-option-code", "reference": "some-option-ref", "name": "Same Option Name", "allow_free_shipping": true }, "merchant_cost": { "value": 123.14, "currency": "BRL" }, "consumer_cost": { "value": 123.14, "currency": "BRL" }, "min_delivery_date": "2022-11-24T10:20:19+00:00", "max_delivery_date": "2022-11-25T10:20:19+00:00", "pickup_details": { "location_id": "pickup-option-id", "name": "Some option pickup detail name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP", "name": "São Paulo" }, "region": { "code": "SE", "name": "Sudeste" }, "country": { "code": "BR", "name": "Brasil" } }, "pickup_hours": [ { "day": "MONDAY", "start": "0800", "end": "1800" } ] }, "extras": { "free_shipping_info": { "free_shipping_id": "1234567", "consumer_original_cost": { "value": 12.34, "currency": "BRL" } }, "phone_required": true, "id_required": true, "accepts_cod": true, "show_time": true, "shippable": true } }, "recipient": { "name": "Some Name", "phone": "11988864311", "identifier": "44112233" }, "assigned_location": { "location_id": "01ARZ3NDEKTSV4RRFFQ69G5DAD", "name": "Location name", "address": { "zipcode": "12910802", "street": "Some Street", "number": "100", "floor": "Some Floor", "locality": "Some Locality", "city": "Some City", "reference": "Some Reference", "between_streets": "Some Between Streets", "province": { "code": "SP", "name": "São o" }, "region": { "code": "SE", "name": "Sudeste" }, "country": { "code": "BR", "name": "Brasil" } } }, "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00"}
```

##### HTTP 400 - Bad Request

| Type | Description 
| Error | The Fulfillment Order Update Error Response 

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

### POST /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events

Create Fulfillment Order Tracking Event

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Notes

- Parameters are sent in body, JSON format.

- FulfillmentOrdeTrackingEventInput.

- Fulfillment Order Must be Already DISPATCHED.

- If the status is DELIVERED, the fulfillment order will be marked as DELIVERED and fulfilled. This means the fulfilled_at field will be filled with the current date and time.

- Tracking event will be limited to a maximum of 100 events. An additional 101st event may be delivered.

- Tracking event must differ from the previous one.

#### Request Payload

| Type | Description 
| FulfillmentOrderTrackingEventInput | The Fulfillment Order Tracking Event Input. 

```
{ "status": "dispatched", "description": "The package was dispatched", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00" }
```

#### Responses

##### HTTP 201 - Created

| Type | Description 
| FulfillmentOrderTrackingEvent | The Fulfillment Order Tracking Event Response. 

###### POST /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV/tracking-events

```
{ "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00"}
```

##### HTTP 400 - Bad Request

| Type | Description 
| Error | The Fulfillment Order Tracking Event Create Error Response 
| Error | The tracking event must not be identical to an existing tracking event 
| Error | Tracking events has reached the limit 

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

#### Duplicate tracking event rules

The API enforces specific rules to detect and reject duplicate tracking events.

A tracking event is considered identical when it has the same:

- status

- description

- address

- geolocation (latitude and longitude)

- happened_at (if provided)

- estimated_delivery_at (if provided)

##### Time window logic

- When `happened_at` is provided: identical events with a time difference of 60 seconds or less are treated as duplicates and rejected.
If the time difference is greater than 60 seconds, the new event is accepted as distinct.

- When `happened_at` is not provided: any identical event is rejected immediately, without a time window.

##### Error message

Duplicate tracking events are rejected with HTTP 400 and the message:

```
The tracking event must not be identical to an existing tracking event
```

### PUT /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events/{fulfillment_order_tracking_event_id}

Update Fulfillment Order Tracking Event

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 
| fulfillment_order_tracking_event_id | String | ✅ | Fulfillment Order Tracking Event Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Notes

- Parameters are sent in body, JSON format

- FulfillmentOrdeTrackingEventInput

- Fulfillment Order Must be Already DISPATCHED and not DELIVERED

- If the status is DELIVERED, the fulfillment order will be marked as DELIVERED and fulfilled. This means the fulfilled_at field will be filled with the current date and time.

#### Request Payload

| Type | Description 
| FulfillmentOrderTrackingEventInput | The Fulfillment Order Tracking Event Input. 

```
{ "status": "in_transit", "description": "The package was sent to cd address.", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00" }
```

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrderTrackingEvent | The Fulfillment Order Tracking Event Response. 

###### PUT /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV/tracking-events/01FHZXHK8PTP9FVK99Z66GXJIO

```
{ "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "in_transit", "description": "The package was sent to cd address.", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00"}
```

##### HTTP 400 - Bad Request

| Type | Description 
| Error | The Fulfillment Order Tracking Event Update Error Response 

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order or Fulfillment Order Tracking Event Error Response 

### DELETE /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events/{fulfillment_order_tracking_event_id}

DELETE Fulfillment Order Tracking Event

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 
| fulfillment_order_tracking_event_id | String | ✅ | Fulfillment Order Tracking Event Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Notes

- Fulfillment Order Must be Already DISPATCHED and not DELIVERED

#### Responses

##### HTTP 204 - Not Content

###### DELETE /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV/tracking-events/01FHZXHK8PTP9FVK99Z66GXJIO

##### HTTP 400 - Bad Request

| Type | Description 
| Error | The Fulfillment Order Tracking Event Delete Error Response 

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order or Fulfillment Order Tracking Event Error Response 

### GET /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events

GET All Fulfillment Order Tracking Events By Fulfillment Order

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrderTrackingEvent[] | List of Fulfillment Order Tracking Events Response. 

###### GET /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV/tracking-events

```
[ { "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00" }]
```

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order Error Response 

### GET /orders/{order_id}/fulfillment-orders/{fulfillment_order_id}/tracking-events/{fulfillment_order_tracking_event_id}

GET Fulfillment Order Tracking Event

#### URL values

| Field name | Field Type | Mandatory | Description 
| store_id | String | ✅ | Store identifier 
| order_id | String | ✅ | Order identifier 
| fulfillment_order_id | String | ✅ | Fulfillment Order Identifier 
| fulfillment_order_tracking_event_id | String | ✅ | Fulfillment Order Tracking Event Identifier 

#### Headers

| Header | Field Type | Mandatory | Description 
| Authentication | String | ✅ | Bearer App token. Eg.: bearer {app_token} 
| Content-type | String | ✅ | The request content-type "application/json" 

#### Responses

##### HTTP 200 - Ok

| Type | Description 
| FulfillmentOrderTrackingEvent | List of Fulfillment Order Tracking Events Response. 

###### GET /orders/123456/fulfillment-orders/01ARZ3NDEKTSV4RRFFQ69G5FAV/tracking-events/01FHZXHK8PTP9FVK99Z66GXJIO

```
{ "id": "01FHZXHK8PTP9FVK99Z66GXJIO", "status": "dispatched", "description": "The package was dispatched", "address": "St. Paul 123, São Paulo - Brazil 02910802", "geolocation": { "longitude": 73.856077, "latitude": 40.848447 }, "happened_at": "2022-11-24T10:20:19+00:00", "estimated_delivery_at": "2022-11-24T10:20:19+00:00", "created_at": "2022-11-24T10:20:19+00:00", "updated_at": "2022-11-24T10:20:19+00:00"}
```

##### HTTP 401 - Unauthorized

| Type | Description 
| Error | The Unauthorized Response 

##### HTTP 404 - Not Found

| Type | Description 
| Error | The Not Found Fulfillment Order or Fulfillment Order Tracking Event Error Response 

## Webhooks

Fulfillment Order Webhooks allow applications to receive automatic notifications whenever relevant events occur in the lifecycle of a Fulfillment Order.

### Available Events

| Event | Description | When it is triggered 
| `fulfillment_order/status_updated` | Notifies about macro status changes of the Fulfillment Order | When the Fulfillment Order status changes (e.g., `PACKED`, `DISPATCHED`, `DELIVERED`) 
| `fulfillment_order/tracking_event_created` | Notifies when a new tracking event is created for a Fulfillment Order | When a new tracking event of the Fulfillment Order is created 
| `fulfillment_order/tracking_event_updated` | Notifies when a tracking event of a Fulfillment Order is updated | When a tracking event of the Fulfillment Order is updated 
| `fulfillment_order/tracking_event_deleted` | Notifies when a tracking event is removed from a Fulfillment Order | When a tracking event of the Fulfillment Order is deleted 

### Payload Structure

Webhook `fulfillment_order/status_updated` sends:

- **store_id**: ID of the store where the event occurred

- **event**: Name of the triggered event

- **order_id**: ID of the order associated with the Fulfillment Order

- **fulfillment_id**: Unique ID of the Fulfillment Order (ULID)

- **status**: Fulfillment Order status

Webhooks `fulfillment_order/tracking_event_created`, `fulfillment_order/tracking_event_updated` and `fulfillment_order/tracking_event_deleted` send:

- **store_id**: ID of the store where the event occurred

- **event**: Name of the triggered event

- **order_id**: ID of the order associated with the Fulfillment Order

- **fulfillment_id**: Unique ID of the Fulfillment Order (ULID)

- **tracking_event_id**: Unique ID of the Fulfillment Order tracking event (ULID)

- **status**: Tracking event status (see [FulfillmentOrderTrackingEventStatus](#fulfillmentordertrackingeventstatus))

#### fulfillment_order/status_updated

Triggered when a Fulfillment Order status is updated.

```
{ "store_id": "5145204", "event": "fulfillment_order/status_updated", "order_id": "1822717346", "fulfillment_id": "01K9QFMHKYRJGQV5Y289WBYMFZ", "status": "DISPATCHED"}
```

**Payload fields:**

- `store_id`: Store ID

- `event`: Event name (`fulfillment_order/status_updated`)

- `order_id`: Order ID

- `fulfillment_id`: Unique Fulfillment Order ID (ULID)

- `status`: Fulfillment Order status (see [FulfillmentOrderStatus](#fulfillmentorderstatus))

#### fulfillment_order/tracking_event_created

Triggered when a new tracking event is created for a Fulfillment Order.

```
{ "store_id": "5145204", "event": "fulfillment_order/tracking_event_created", "order_id": "1822717346", "fulfillment_id": "01K9QFMHKYRJGQV5Y289WBYMFZ", "tracking_event_id": "01K9QQ16GPYVDHZPAEGK3SFZAD", "status": "in_transit"}
```

**Payload fields:**

- `store_id`: Store ID

- `event`: Event name (`fulfillment_order/tracking_event_created`)

- `order_id`: Order ID

- `fulfillment_id`: Unique Fulfillment Order ID (ULID)

- `tracking_event_id`: Unique Fulfillment Order tracking event ID (ULID)

- `status`: Tracking event status (see [FulfillmentOrderTrackingEventStatus](#fulfillmentordertrackingeventstatus))

#### fulfillment_order/tracking_event_updated

Triggered when a tracking event of a Fulfillment Order is updated.

```
{ "store_id": "5145204", "event": "fulfillment_order/tracking_event_updated", "order_id": "1822717346", "fulfillment_id": "01K9QFMHKYRJGQV5Y289WBYMFZ", "tracking_event_id": "01K9QQ16GPYVDHZPAEGK3SFZAD", "status": "delivered"}
```

**Payload fields:**

- `store_id`: Store ID

- `event`: Event name (`fulfillment_order/tracking_event_updated`)

- `order_id`: Order ID

- `fulfillment_id`: Unique Fulfillment Order ID (ULID)

- `tracking_event_id`: Unique Fulfillment Order tracking event ID (ULID)

- `status`: Tracking event status (see [FulfillmentOrderTrackingEventStatus](#fulfillmentordertrackingeventstatus))

#### fulfillment_order/tracking_event_deleted

Triggered when a tracking event of a Fulfillment Order is deleted.

```
{ "store_id": "5145204", "event": "fulfillment_order/tracking_event_deleted", "order_id": "1822717346", "fulfillment_id": "01K9QFMHKYRJGQV5Y289WBYMFZ", "tracking_event_id": "01K9QQ16GPYVDHZPAEGK3SFZAD", "status": "delivered"}
```

**Payload fields:**

- `store_id`: Store ID

- `event`: Event name (`fulfillment_order/tracking_event_deleted`)

- `order_id`: Order ID

- `fulfillment_id`: Unique Fulfillment Order ID (ULID)

- `tracking_event_id`: Unique Fulfillment Order tracking event ID (ULID)

- `status`: Tracking event status (see [FulfillmentOrderTrackingEventStatus](#fulfillmentordertrackingeventstatus))

### Webhook Registration

To receive notifications for these events, you must register webhooks through the Webhooks API.

See the [complete Webhooks documentation](/api-documentation/resources/webhook) for detailed information on how to create, update, and manage your webhooks.

**Registration example:**

```
POST /webhooks
```

```
{ "event": "fulfillment_order/tracking_event_created", "url": "https://api.partner.com/webhooks/fulfillment"}
```

### Required Scopes

To receive Fulfillment Order webhooks, your application must have the following scopes:

| Scope | Description 
| `read_fulfillment_orders` | Allows receiving notifications about Fulfillment Orders 
| `write_fulfillment_orders` | Required for write operations on Fulfillment Orders 

### Important Considerations

- **Idempotency**: Webhooks should be implemented in an idempotent way, as the same event may be sent multiple times

- **Timeout**: Your application must respond within 10 seconds with an HTTP 2xx status code

- **Delivery Order**: Events are sent in order of emission, but may be processed asynchronously

- **Security**: It is recommended to validate the origin of requests using the `x-linkedstore-hmac-sha256` header (see [Webhook Verification](/api-documentation/resources/webhook#verifying-a-webhook))

- **Format**: The request body will always be `application/json` and will contain the `event` field

- **Retries**: In case of failure, the system will perform automatic retries according to the [retry policy](/api-documentation/resources/webhook#retry-policies)