---
title: Checkout
source: https://tiendanube.github.io/api-documentation/resources/checkout
version: 2025-03
---

# Checkout

## Payment Options (Javascript Interface)

Our Checkout flow offers different Payment Options that provides consumers with the means to pay for an order with the payment method of their choice. Payments App developers can create their own Payment Options.

Payment Options configuration params are set via our [Payment Provider API](/api-documentation/resources/payment-provider) by adding [`checkout_payment_options`](/api-documentation/resources/payment-provider#checkout-payment-options) on the Payment Provider object creation.

Our Checkout triggers a variety of events for which we provide a JavaScript API that allows you to handle these events freely to perform the payment process. Hence, you can implement their *(most likely)* already existing and widely tested Javascript SDKs.

The file with the handlers implemented for the different options should be hosted on a CDN that must be capable of handling high traffic loads. The HTTPS URL to this file must be set in the [Payment Provider](/api-documentation/resources/payment-provider) `checkout_js_url` property.

> Note: The file mentioned above must use data from method [`getData`](#getdata) of Checkout Context. However, in case you need to use data stored in Local Storage, for example, you should [create a Script](/api-documentation/resources/script) and use the method [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to send information stored in Local Storage from the store domain to Checkout's private domain. With this information inside the secure domain, the `checkout_js` file will be able to send it to your backend.

## Examples

### External Payment Option

Let's take a look at a simple script for a hypothetical integration with a Payment Provider that redirects the consumer to *'acmepayments.com'* to complete the purchase in their checkout. This is what we call a `redirect` checkout.

```
// Call 'LoadCheckoutPaymentContext' method and pass a function as parameter to get access to the Checkout context and the PaymentOptions object.LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) { // Create a new instance of external Payment Option and set its properties. var AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({ // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout. id: "acme_redirect", // Indicate that this payment option implements backend to backend payment processing. version: 'v2', // This parameter renders the billing information form and requires the information to the consumer. fields: { billing_address: true, }, // This function handles the order submission event. onSubmit: function (callback) { // Gather any additional information needed. var extraCartData = { currency: Checkout.getData("order.cart.currency"), }; // Use the Checkout.processPayment method to make a request to your app's API and get the redirect URL through our backend. Checkout.processPayment(extraCartData) .then(function(responseData) { // In case of success, redirect the consumer to the generated URL. window.parent.location.href = responseData.redirect_url; }).catch(function(error) { // In case of error, show a proper error message to the consumer. Checkout.showErrorCode(error.response.data.message); }); }, }); // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider. Checkout.addPaymentOption(AcmeExternalPaymentOption); // Or remove payment option loading. Checkout.unLoadPaymentMethod('acme_redirect');});
```

### Card Payment Option

This is a more complex example, since this is a richer interaction with more control over the consumer experience. The entire flow happens without leaving the Nuvemshop checkout, in what we call a `transparent` checkout.

This type of payment renders a form where the consumer inputs their credit card information and with which you can interact.

In this example, whenever the consumer inputs or changes the credit card number we fetch the first 6 digits and populate the list of available installments.

```
LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) { var currentTotalPrice = Checkout.getData("order.cart.prices.total"); var currencCardBin = null; // Some helper functions. // Get credit the card number from transparent form. var getCardNumber = function () { return Checkout.getData("form.cardNumber"); }; // Get the first 6 digits from the credit card number. var getCardNumberBin = function () { return getCardNumber().substring(0, 6); }; // Check whether the BIN (first 6 digits of the credit card number) has changed. If so, we intend to update the available installments. var mustRefreshInstallments = function () { var cardBin = getCardNumberBin(); var hasCardBin = cardBin && cardBin.length >= 6; var hasPrice = Boolean(Checkout.getData("totalPrice")); var changedCardBin = cardBin !== currencCardBin; var changedPrice = Checkout.getData("totalPrice") !== currentTotalPrice; return hasCardBin && hasPrice && (changedCardBin || changedPrice); }; // Update the list of installments available to the consumer. var refreshInstallments = function () { // Let's imagine the App provides this endpoint to obtain installments. Checkout.http .post("https://acmepayments.com/card/installments", { amount: Checkout.getData("totalPrice"), bin: getCardNumberBin(), }) .then(function (response) { Checkout.setInstallments(response.data.installments); }); }; // Create a new instance of card Payment Option and set its properties. var AcmeCardPaymentOption = PaymentOptions.Transparent.CardPayment({ // Set the option's unique ID as it is configured on the Payment Provider so then can be related at the checkout. id: "acme_transparent_card", // Indicate that this payment option implements backend to backend payment processing. version: 'v2', // Event handler for form field input. onDataChange: Checkout.utils.throttle(function () { if (mustRefreshInstallments()) { refreshInstallments(); } else if (!getCardNumberBin()) { // Clear installments if customer remove credit card number. Checkout.setInstallments(null); } }), onSubmit: function (callback) { // Gather any additional information needed. var extraCartData = { currency: Checkout.getData("order.cart.currency"), card: { number: Checkout.getData("form.cardNumber"), name: Checkout.getData("form.cardHolderName"), expiration: Checkout.getData("form.cardExpiration"), cvv: Checkout.getData("form.cardCvv"), installments: Checkout.getData("form.cardInstallments"), }, }; // Use the Checkout.processPayment method to post a payment request to your app's API through our backend. Checkout.processPayment(extraCartData) .then(function(responseData) { // Do something with the payment request result if necessary... }).catch(function(error) { // In case of error, show a proper error message to the consumer. Checkout.showErrorCode(error.response.data.message); }); }, }); // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider. Checkout.addPaymentOption(AcmeCardPaymentOption);});
```

### Modal Payment Option

Modal is lightbox or modal with an embedded iframe containing the Payment Provider's checkout UI on the merchant's website. The checkout flow is run under the Payment Provider's domain, but the buyer never really leaves the Merchant's website.

When the consumer submits our checkout, a modal rendered by the Payment Provider is displayed and the consumer finishes the payment process on it.

```
LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) { var CheckoutPayment = new PaymentOptions.ModalPayment({ id: "modal", name: "Credit Card", version: 'v2', onSubmit: function (callback) { var modalData = { storeId: Checkout.getData("storeId"), orderId: Checkout.getData("order.cart.id"), amount: Checkout.getData("order.cart.prices.total") }; var modalUrl = Checkout.utils.setQueryString("http://localhost:3003/", modalData) // In this param object you could pass any iframe attribute. Example: src, id, className, frameBorder, style. var iframeData = { src: modalUrl } var iframeConfigs = { showBackDrop: false } this.createModal(iframeData, iframeConfigs); // This event listens for the modal's response from your domain. var modalEventHandler = (event) => { // The method `parseModalResponse` validate the response because in some cases it was a string. var response = this.parseModalResponse(event.data) if (response.type === "PAYMENT_MODAL_RESPONSE") { // Removing event to avoid duplicated messages. window.removeEventListener("message", modalEventHandler) // This method should be called to proceed with payment or failure. Checkout.processPayment(response.data) .then(function(paymentResponse) { // Handle payment request response. }).catch(function(error) { Checkout.showErrorCode(error.response.data.message); }); } } window.addEventListener("message", modalEventHandler); }, }); // Finally, add the Payment Option to the Checkout object. Checkout.addPaymentOption(CheckoutPayment);});
```

On your website which will be rendered by the iframe you have three possible answers

##### Close modal button

```
window.parent.postMessage({ type: "PAYMENT_MODAL_RESPONSE", data: { success: true, closeModal: true }}, '*');
```

##### Failed payment

```
window.parent.postMessage({ type: "PAYMENT_MODAL_RESPONSE", data: { success: false, error_code: 'payment_processing_error' }}, '*');
```

##### Success payment

```
window.parent.postMessage({ type: "PAYMENT_MODAL_RESPONSE", data: { success: true }}, '*');
```

## Checkout Context

The `LoadCheckoutPaymentContext` function takes function as a argument, which will be invoked with two arguments, `Checkout` and `PaymentOptions`, to provide access to our Checkout's context.

| Name | Description 
| `http` | Method to perform AJAX requests. See [HTTP](#http). 
| `utils` | Collection of helper functions. See [Utils](/api-documentation/utils/postman-collections). 
| `updateFields` | Allows adding or removing optional input fields from the payment option form. 
| `addPaymentOption ` | Register the option so the checkout can inject the configuration params and render it. 
| `setInstallments ` | Update the attributes of the `data. installments` object. See [Installments](#installments). 
| `getData` | Method to obtain the data of the shopping cart, the consumer and more. See [getData](#getdata). 
| `processPayment` | Method to perform backend-to-backend processing of a payment request. See [processPayment](#processpayment). 
| `showErrorCode` | Method to display an error message at the payment option form. See [showErrorCode](#showerrorcode). 

### Checkout

#### HTTP

This object is an [Axios instance](https://github.com/axios/axios#request-config). Though the `fetch` is now available on all major object, using this method ensures cross-browser compatibility and it will also allow us to detect unexpected behaviours for which we'll be able to trigger alerts.

> Note: This instance of Axios already has a few params set by the Checkout.

##### Standard POST example

```
Checkout.http .post("https://acmepayments.com/card/installments", { cartId: cartId, }) .then(function (response) { // Do something with the response. });
```

##### Custom config request example

```
Checkout.http({ url: "https://acmepayments.com/card/installments", method: "post", data: { cartId: cartId, },}).then(function (response) { // Do something with the response.});
```

#### Utils

- `Checkout.utils.Throttle`

- `Checkout.utils.LoadScript`

- `Checkout.utils.FlattenObject`

#### getData

The Checkout object provides the app with access to all the data related with ongoing sale. We've got the following data groups:

- Cart Information: `Checkout.getData('order.cart')`.

- Total cart price: `Checkout.getData('totalPrice')` (also indicated by `Checkout.getData('order.cart.prices.total')`).

- ID of the store to which the cart belongs: `Checkout.getData('storeId')`.

- Customer Contact Information: `Checkout.getData('order.contact')`.

- Billing Information: `Checkout.getData('order.billingAddress')`.

- Shipping Information: `Checkout.getData('order.shippingAddress')`.

- Shipping Method Information: `Checkout.getData('order.cart.shipping')`.

- Payment Method Information: `Checkout.getData('form')`.

*Note:* No all Payment Method Information fields are rendered. They can be rendered as explained [here](#fields-property).

Here's an example of the data available in the `Checkout.getData()` object (rendered as JSON for better readability):

```
{ "form": {}, "totalPrice": 135, "country": "AR", "storeId": 1196173, "storeUrl": "https://examplestore.com", "callbackUrls": { "success": "https://examplestore.com/checkout/v3/success/375854104/aebe04afab671411e6d75352fb4f514898b1667a", "failure": "https://examplestore.com/checkout/v3/next/375854104/aebe04afab671411e6d75352fb4f514898b1667a", "cancel": "https://examplestore.com/checkout/v3/next/375854104/aebe04afab671411e6d75352fb4f514898b1667a" }, "order": { "cart": { "id": 375854104, "hash": "aebe04afab671411e6d75352fb4f514898b1667a", "number": null, "prices": { "shipping": 15, "discount_gateway": 0, "discount_coupon": 30, "discount_promotion": 0, "discount_coupon_and_promotions": 30, "subtotal_with_promotions_applied": 150, "subtotal_with_promotions_and_coupon_applied": 120, "subtotal": 150, "total": 135, "total_usd": 0 }, "lineItems": [ { "id": 451294379, "name": "Example Product 1", "price": "50.50", "quantity": 1, "free_shipping": false, "product_id": 58979310, "variant_id": 175499404, "thumbnail": "//d2qa76c3k7tf6c.cloudfront.net/stores/001/196/173/products/example-product-1.jpg", "variant_values": "", "sku": null, "properties": [], "url": "https://examplestore.com/productos/example-product-1/?variant=175499404", "is_ahora_12_eligible": true }, { "id": 451294230, "name": "Example Product 2", "price": "99.50", "quantity": 1, "free_shipping": false, "product_id": 58979280, "variant_id": 175499176, "thumbnail": "//d2qa76c3k7tf6c.cloudfront.net/stores/001/196/173/products/example-product-2.jpg", "variant_values": "", "sku": null, "properties": [], "url": "https://examplestore.com/productos/example-product-2/?variant=175499176", "is_ahora_12_eligible": true } ], "currency": "ARS", "currencyFormat": { "short": "$%s", "long": "$%s ARS" }, "lang": "es", "langCode": "es_AR", "coupon": { "id": 1566261, "code": "DESC20", "type": "percentage", "value": "20.00", "valid": true, "used": 0, "max_uses": null, "start_date": null, "end_date": null, "min_price": null, "categories": null }, "shipping": { "type": "ship", "method": "correo-argentino", "option": 6111227, "branch": null, "disabled": null, "raw_name": "Correo Argentino - Encomienda Clásica", "suboption": null }, "status": { "order": "open", "order_cancellation_reason": null, "fulfillment": "unpacked", "payment": "pending" }, "completedAt": null, "minimumValue": null, "hasNonShippableProducts": false, "hasShippableProducts": true, "isAhora12Eligible": true }, "shippingAddress": { "first_name": "John", "last_name": "Doe", "phone": "+54123456789", "address": "Example Street", "number": "1234", "floor": "", "locality": "Valentín Alsina", "city": "Lanús", "state": "Buenos Aires", "zipcode": "1822", "country": "AR", "between_streets": "", "reference": "", "id_number": "11223344" }, "billingAddress": { "first_name": "John", "last_name": "Doe", "phone": "+54123456789", "address": "Example Street", "number": "1234", "floor": "", "locality": "Valentín Alsina", "city": "Lanús", "state": "Buenos Aires", "zipcode": "1822", "country": "AR", "between_streets": "", "reference": "", "id_number": "11223344" }, "contact": { "email": "john.doe@example.com", "name": "John Doe", "phone": "+54123456789" }, "customer": 123123123 }}
```

> **Note:** `contact->customer` is the logged in user ID or `undefined` if the customer is not logged in.

#### Legacy JS Integration

The legacy JS integration is a way to make payment requests to the app's API directly from the JS script. Since this is currently deprecated, we only maintain its documentation for backward compatibility. For more information, see the [Process Payment API](/api-documentation/guides/payment-provider#process-payment-api) specification.

##### External Payment Option Example Deprecated

```
LoadCheckoutPaymentContext(function(Checkout, PaymentMethods) {	var External = PaymentMethods.ExternalPayment({		id: 'acme_redirect',				version: 'v1',				onSubmit: function(callback) {			let acmeRelevantData = {				orderId: Checkout.getData("order.cart.id"),				currency: Checkout.getData("order.cart.currency"),				total: Checkout.getData("order.cart.prices.total"),			};			Checkout.http				.post("https://app.acme.com/generate-checkout-url", {					data: acmeRelevantData,				})				.then(function(responseBody) {					if (responseBody.data.success) {						callback({							success: true,							redirect: responseBody.data.redirect_url,							extraAuthorize: true,						});					} else {						callback({							success: false,							error_code: responseBody.data.error_code,						});					}				})				.catch(function(error) {					callback({						success: false,						error_code: "payment_processing_error",					});				});		}	});		Checkout.addPaymentOption(External);});
```

##### Transparent Payment Option Example Deprecated

```
LoadCheckoutPaymentContext(function(Checkout, PaymentMethods) {	var TransparentCard = PaymentOptions.Transparent.CardPayment({		id: "acme_transparent_card",				version: 'v1',				onSubmit: function(callback) {			let acmeRelevantData = {				orderId: Checkout.getData("order.cart.id"),				currency: Checkout.getData("order.cart.currency"),				total: Checkout.getData("order.cart.prices.total"),				card: {					number: Checkout.getData("form.cardNumber"),					name: Checkout.getData("form.cardHolderName"),					expiration: Checkout.getData("form.cardExpiration"),					cvv: Checkout.getData("form.cardCvv"),					installments: Checkout.getData("form.cardInstallments"),				},			};			Checkout.http				.post("https://acmepayments.com/charge", acmeCardRelevantData)				.then(function(responseBody) {					if (responseBody.data.success) {						callback({							success: true,						});					} else {						callback({							success: false,							error_code: responseBody.data.error_code,						});					}				})				.catch(function(error) {					callback({						success: false,						error_code: "payment_processing_error",					});				});		}	});		Checkout.addPaymentOption(TransparentCard);});
```

#### processPayment

This method allows your app to process *backend-to-backend* payment requests. As described in our [Payment Provider App Development Guide](/api-documentation/guides/payment-provider#process-payment-api) documentation, for this use case our platform implements a generic payment payload that can be adapted to a specific payload that conforms to your app's API. But also, if necessary, this standard payload can be extended by adding custom data inside an `extra` object. The content of that `extra` object, which is optional, must be passed to the `processPayment` method as parameter.

> **Note:** It is necessary to indicate the value `v2` in the `version` field explicitly in order to enable a Payment Option to process payments through the `Checkout.processPayment` method. Otherwise, payment requests made using this method will fail.

Here's an example:

```
LoadCheckoutPaymentContext(function(Checkout, PaymentMethods) { var External = PaymentMethods.ExternalPayment({ id: 'acme_redirect', version: 'v2', onSubmit: function(callback) { let extraData = { "email": Checkout.getData('order.contact.email') } Checkout.processPayment(extraData) .then(function(responseData) { window.parent.location.href = responseData.redirect_url; }).catch(function(error) { Checkout.showErrorCode(error.response.data.message); }); } }); Checkout.addPaymentOption(External);});
```

#### showErrorCode

This method displays an error message for the consumer at the payment option form. It takes any value defined in our [error code library](/api-documentation/resources/transaction#transaction-failure-codes) as a parameter, which will be translated into the corresponding error message according to the language used by the store.

```
LoadCheckoutPaymentContext(function(Checkout, PaymentMethods) { var Custom = PaymentMethods.CustomPayment({ id: 'acme_custom', onSubmit: function(callback) { if (Checkout.getData('totalPrice') 

### PaymentOptions

The second argument of the function passed as an argument to `LoadCheckoutPaymentContext` is `PaymentOptions`. It contains functions for each of the different possible integration types. Each of the functions take a configuration object as an argument and, in turn, will return a javascript instance of the `PaymentOption`.

| Name | Description 
| `ExternalPayment()` | Returns an instance of the PaymentOption for integration types that require redirecting the consumer to a different website. 
| `ModalPayment()` | Returns an instance of the PaymentOption for integration types that require opening a Modal in the store's frontend. 
| `CustomPayment()` | Used internally for the merchant's custom payment methods. 
| `Transparent` | Object that contains functions to obtain instances for transparent integration types. 

Note: ExternalPayment and ModalPayment won't render any input fields on the frontend. The main difference between them is on their `onSubmit` `callback` parameters.

#### Transparent Integration Type

The `PaymentOptions.Transparent` has one function per each of the payment methods for which we support transparent integration type. Each of these functions return an instance of the `PaymentOption` for their specific payment methods and, if added to the Checkout using `Checkout.addPaymentOption(paymentOptionInstance)` a form will be rendered with all the required input fields for that payment method.

| Name | Description 
| `CardPayment()` | For `credit_card` and `debit_card` payment methods. 
| `DebitPayment()` | For `bank_debit` payment method (aka "online debit"). 
| `BoletoPayment()` | For payments with `boleto` payment method. 
| `TicketPayment()` | For payments with `ticket` payment method. 
| `PixPayment()` | For payments with `pix` payment method. 

##### CardPayment

These are the fields rendered and available on the `Checkout.getData('form')` object.

| Name | Description | Required | `fields` value 
| `cardNumber` | Card number. | Always | 
| `cardHolderName` | Card holder's name. | Always | 
| `cardExpiration` | Card's expiration date in `mm/yy` format. | Always | 
| `cardCvv` | Card's verification code. | Always | 
| `cardInstallments` | Number of installments selected by the consumer. | Always | 
| `cardHolderIdNumber` | Card holder's identification (CPF, DNI or equivalent). | Optional | `card_holder_id_number` 
| `cardHolderIdType` | Card holder's identification (CPF, DNI or equivalent). | Optional | `card_holder_id_types` 
| `cardHolderBirthDate` | Card holder's birthday in `dd/mm/yy` format. | Optional | `card_holder_birth_date` 
| `cardHolderPhone` | Card holder's phone number. | Optional | `card_holder_phone` 
| `bankId` | Card's issuing bank. | Optional | `bankList` 

> `cardBrand` is inserted after the consumer enters the first six credit card numbers.

##### DebitPayment

These are the input fields rendered and available in the object `Checkout.getData('form')`.

| Name | Description | Required | `fields` value 
| `bank` | Bank to debit from. | Optional | `bank_list` 
| `holderName` | Account holder's name. | Optional | `debit_card_holder_name` 
| `holderIdNumber` | Account holder's identification (CPF, DNI, or equivalent). | Optional | `debit_card_id_number` 

##### BoletoPayment

These are the input fields rendered and available in the object `Checkout.getData('form')`.

| Name | Description | Required | `fields` value 
| `holderName` | Consumer's name. | Optional | `boleto_holder_name` 
| `holderIdNumber` | Consumer's identification (CPF, CNPJ or equivalent). | Optional | `boleto_id_number` 

##### TicketPayment

These are the input fields rendered and available in the object `Checkout.getData('form')`.

| Name | Description | Required | `fields` value 
| `brand` | Brand name for selected cash list option | Always | `efectivo_list` 
| `efectivo_list` | Brand name for selected ticket or boleto list option | Always | `[{ name: 'Pago Fácil', code: 'pagofacil' }, { name: 'Rapipago', code: 'rapipago' }, { name: 'Caixa', code: 'caixa' }, { name: 'Itaú', code: 'itau' }, ...]` 
| `ticketHolderIdNumber` | buyer document | Optional | `ticket_holder_id_number` 
| `ticketHolderIdType` | buyer document type | Optional | `ticket_holder_id_types: [{ "code": "DNI", "name": "DNI" }, { "code": "CI", "name": "Cédula" }, ...]` 

##### PixPayment

These are the input fields rendered and available in the object `Checkout.getData('form')`.

| Name | Description | Required | `fields` value 
| `holderName` | Consumer's name. | Optional | `holder_name` 
| `holderIdNumber` | Consumer's identification (CPF). | Optional | `holder_id_number` 

#### PaymentOption Configuration Object and it's properties

All `PaymentOptions` functions take a configuration object. The generic properties of the configuration object for all `PaymentOptions` are:

| Name | Description 
| `id` | Must match the `id` set in the Payment Provider's `checkout_payment_options[i]`. 
| `name` | Payment option display name. 
| `version` | Payment processing integration version. `v1` for legacy integration (callbacks). `v2` for backend to backend payment processing. 
| `fields` | Object containing a properties of extra input fields for transparent payment options and a boolean value to wither render it or not. 
| `scripts` | List of external JavaScript files to be loaded before registering this method. 
| `onLoad` | Function to be invoked after registering this method. 
| `onDataChange` | Function to be invoked whenever there's a change in checkout data. 
| `onSubmit` | Function to be invoked whenever the consumer clicks on "Finish checkout" and all mandatory fields are filled correctly. 

##### fields property

For each of the transparent payment options, the following extra input fields can be rendered if specified in this property.

###### CreditPayment

| Name | Description 
| `bankList` | Banks list. 
| `issuerList` | Banks list. *(AR only)* 
| `card_holder_id_types` | Card holder identification type selector. 
| `card_holder_id_number` | Card holder identification number. 
| `card_holder_birth_date` | Card holder birth date. 
| `card_holder_phone` | Card holder number. 

###### DebitPayment

| Name | Description 
| `bank_list` | Banks list. 

###### BoletoPayment

| Name | Description 
| `boleto_holder_name` | Payer name. 
| `boleto_id_number` | Payer id number. 

> No including an input field on this object is enough to prevent it from rendering. It's not necessary to set it as `false`.

###### For all payment options

| Name | Description 
| `billing_address` | Billing information. 

> `PixPayment` doesn't render any input. The payment instructions are displayed after closing the order.

###### Updating the fields dynamically

```
Checkout.updateFields({ method: "acme_transparent_card", value: { bankId: true, },});
```

##### onSubmit

The handler function for the `onSubmit` event must perform the payment processing request using the `Checkout.processPayment()` method, as well as handle errors during this request using the `Checkout.showError()` method.

Here's an example summarizing all the definitions above.

```
LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) { var TransparentCard = PaymentOptions.Transparent.CardPayment({ id: "acme_transparent_card", version: 'v2', fields: { card_holder_birth_date: true, }, onLoad: function () { // Do something after the script loads. // Example: generate a token. }, onDataChange: Checkout.utils.throttle(function () { // Do something when the input form data changes. // Data changed is already available on `Checkout.getData()`. // Example: update credit card installments when the order value changes. }, 700), onSubmit: function (callback) { const extraCartData = { // Gather any additional information needed. }; Checkout.processPayment(extraCartData) .then(function(responseData) { // Handle payment request response. }).catch(function(error) { // Handle potential errors. Checkout.showErrorCode(error.response.data.message); }); }, }); Checkout.addPaymentOption(TransparentCard);});
```

#### Installments

In order to offer installment's options you must update the object `data.installments` by calling `setInstallments`. This will update the select input for the installments options on the card information form. Installments must be set considering the `min_installment_value` configured in [Payment Provider](/api-documentation/resources/payment-provider#installments). The Merchant should be able to configure this field in the Partner's Backend.

Each element of the list must be an object with the following fields.

| Name | Description 
| `quantity` | Number of installments. 
| `installmentAmount` | Value of a single installment. 
| `totalAmount` | Total value of all installments. 
| `cft` | (optional)[String] Total financial cost. 

##### Example

```
Checkout.setInstallments([ { quantity: 1, installmentAmount: 25, totalAmount: 25, cft: "0,00%", }, { quantity: 2, installmentAmount: 13, totalAmount: 26, cft: "199,26%", }, { quantity: 3, installmentAmount: 10, totalAmount: 30, cft: "196,59%", },]);
```

## Appendix

### Checkout Runtime Error Codes

If for some reason the `onSubmit` event handler fails to execute the action expected by the payment option chosen by the consumer, an `error_code` must be specified using the `Checkout.showErrorCode(error_code)` method in order to allow us to give the consumer clear information on what went wrong so the consumer understands what they need to do in order be able to fix the problem.

All [Transaction Failure Codes](/api-documentation/resources/transaction#transaction-failure-codes) are valid `error_codes`, in addition to those specified below:

| Failure Code | Description 
| `server_error` | There is a problem accessing the server which prevents either the execution of the payment or the generation of the redirect URL. 
| `server_error_timeout` | Same as `server_error` but the problem is due to a timeout condition. 
| `payment_processing_error` | There was a problem processing the payment. Use this error as default only if it is not possible to use another error code from the list. 

### Remove payment option loading

If for some reason, the partner needs to unload a payment option that will not be rendered, they can use the `unLoadPaymentMethod` method instead of the `addPaymentOption` method.

```
LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) { var acmeRedirectId = "acme_redirect"; var AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({ id: acmeRedirectId, onSubmit: function (callback) { // onSubmit handling }, }); var shouldRender = false; if (shouldRender) { Checkout.addPaymentOption(AcmeExternalPaymentOption); } else { Checkout.unLoadPaymentMethod(acmeRedirectId); }});
```

### Checkout Captcha Information

To provide more flexibility to our partners, during the execution of the `processPayment` flow, our checkout layer is adding new captcha-related data inside the extra object, which is already created and sent by the partner and forwarded through the flow.

Specifically, within this extra object, we are introducing a new field called `checkout_captcha_info`, which contains the result of our captcha validation along with the bot score.

We believe this additional data can further support partners in their decision-making process when identifying and flagging suspicious orders (for example, potential bot activity or similar behavior).

> Note: This data about captcha in only enable in payment version: `v2`

```
// ✅ Example of success{ "checkout_captcha_info": { "bot_score": 97, "captcha_result": { "success": true, "errorCodes": [] } }}// ❌ Example of failure{ "checkout_captcha_info": { "bot_score": 5, "captcha_result": { "success": false, "errorCodes": ["timeout-or-duplicated"] } }}
```