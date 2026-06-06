---
title: Scripts
source: https://tiendanube.github.io/api-documentation/resources/script
version: 2025-03
---

# Scripts

The Script resource allows an app to register a custom Javascript file to be loaded and executed in the Merchant's storefront page. More precisely, on products (store) and payment (checkout) pages.

This is necessary when apps, besides its page on the Merchant's admin, must also impact the merchant store web page in some manner. For example, an App that recoveries user's carts might want to display a dialog component in which the user can see previous carts and choose which one to recover.

The script is inserted in the HTML code of the Merchant's webpage in a ` html tag` the decision process of loading a custom script or not is based on the script configuration that will be soon explained.

Apps that require a script to work fully should be registered in the Partner's portal with the `scripts` scope permission assigned. This permission will be added to the apps scopes and guarantees that every time a merchant decides to install the app, they will be required to accept a term of use that informs them that an additional script will be run in their storefront. Apps without this permission won't be able to have scripts being associated.

## Important

- It's the Partner's responsibility to guarantee that the script doesn't generate errors in the Merchant's page

- Once an App is uninstalled, the script won't be loaded anymore

- The script should not depend on any JavaScript available in the store's theme. Not even jQuery.

- Other Apps might also include their own scripts

- Tiendanube layouts have [HTML selectors](https://docs.nuvemshop.com.br/help/pontos-de-anchoragem) so modifications can be made by scripts while the original theme code stays the same

- The script is injected in the merchant storefront and a store (id) parameter is sent along with it

```

```

Observation: the `versionId` is an internal Tiendanube's ID that can be ignored. The important information in this example is the parameter `store=1234`

## Script code

The script code will be loaded in the Merchant's storefront and executed in the client's browsers. It can modify the HTML of the page using [HTML selectors](https://docs.nuvemshop.com.br/help/pontos-de-anchoragem) or execute AJAX calls.

### Considerations

#### Clojure

Ideally, your javascript should be inside a closure to avoid any external conflicts:

```
(function () { // Your JavaScript})();
```

#### AJAX

Use AJAX to load store configurations by accessing a URL with the store ID. The app will return store settings in JSON format for use in your JavaScript.

#### JQuery

In case jQuery is necessary, it should be accessed by the `useJquery` method. Some stores already have jQuery in their themes, but it's not necessarily the latest version.
Some store's themes includes their own version of JQuery, which might vary. If the store theme doesn't use it, then a default recent version will be provided (3.6)

`useJquery` is a Promise and resolves once jQuery is loaded.

```
useJquery().then( (jq) => { console.log(`I'm using jQuery version ${jq().jquery}`) // MyApp.init(jq); });
```

> Important: This function ensures jQuery is available, but it doesn't ensure its version.

### Variables

A Javascript object (called `LS`) with some common variables is available in the Script context.
The object contains general Tiendanube's domain information that might be relevant for the script implementation.

Each storefront page has its own `LS` object definition

#### Store Page

```
var LS = { store : { id : /* Store's id */, url : /* Store's URL */ }, cart : { subtotal : /* Cart's subtotal in cents */, items : [ /* For every cart item we have */ { id: /* Product Variant's id */, name: /* Product Variant's name */, unit_price: /* Product Variant's price in cents */, quantity: /* Quantity to be purchased */, requires_shipping: /* True if product requires physical shipping */ } ], has_shippable_products : /* True if at least one product requires physical shipping */, has_non_shippable_products : /* True if at least one product doesn`t require physical shipping */ }, lang : /* Current language's code (e.g. pt_BR) */, currency : { code: /* Current currency in ISO 4217 format */, display_short: /* Currency format string when the currency is not specified.*/, display_long: /* Currency format string when the currency is specified.*/, cents_separator: /* Symbol used for separating cents */, thousands_separator: /* Symbol used for separating thousands (could be blank) */ }, country : /* Current currency in ISO 3166-1 format */, customer : /* Current customer id or null if there is no logged-in customer */, theme : { code: /* Current theme's code */, name: /* Current theme's name */ }}
```

#### Product Page

```
LS.product = { id : /* Product's id */, name : /* Product's name */, tags : /* Array of product's tags */, requires_shipping : /* True if product requires physical shipping */};LS.variants = /* JSON encoded representation of the product variants */;
```

#### Category Page

```
LS.category = { id : /* Category's id */, name : /* Category's name */};
```

#### Checkout Page

> **Important:** Mandatory migration for Checkout scripts by 10/30. If your application uses scripts in the Checkout, you must migrate them to the new SDK to ensure they continue working after that date. [Learn more about NubeSDK](https://dev.tiendanube.com/docs/applications/nube-sdk/overview)

```
var LS = { store : { id : /* Store's id */, url : /* Store's URL */ }, cart : { subtotal : /* Cart's subtotal in cents */, items : [ /* For every cart item we have */ { id: /* Product Variant's id */, name: /* Product Variant's name */, unit_price: /* Product Variant's price in cents */, quantity: /* Quantity to be purchased */, } ] }, customer : /* Current customer id or null if there is no logged-in customer */, lang : /* Current language's code (e.g. pt_BR) */, currency : /* Current currency in ISO 4217 format */}
```

> Note: You cannot access this variable from the [JavaScript file](/api-documentation/resources/checkout#payment-options-javascript-interface) where developers can create their own Payment Options.

#### Thank you page

```
LS.order = { id : /* Order's id */, number : /* Order's number */, hash : /* Order's hash */, created_at : /* Order's creation date */, coupon : /* Array of coupon codes that apply to this order */, discount : /* Order's discount in cents */, total : /* Order's total in cents */, total_in_usd : /* Order's total in USD in cents */, gateway : /* Payment Gateway's code */};
```

## Scripts Management

Before being executed in the Merchant's page, scripts need to be created and configured. This section's goal is to explain this process.

- First thing to understand is that a script and its file are understood as different entities

`Scripts` are a set of client-side actions necessary for the app to reach its full capabilities

- `Version` is the actual implementation of those actions

- In a sense, the `Script` entity is `what` needs to be done in the storefront and the `Version` entity is `how` it'll be done

That being said, a Script can have multiple versions in its lifecycle. Let's say that the goal of a script is to provide a way for Merchant's clients to select previous lost Cart, the starting version of the script might show a dialog with past carts, and a future version of the script might integrate this past carts in the page's interface.
There must be a way for the user to select a past cart (`WHAT`) and the App script will provide a way to do so, and the way it does that might change overtime in different versions.

### Creating a Script

The scripts are managed in Tiendanube's Partners Portal. To register a script:

- Access [https://partners.tiendanube.com](https://partners.tiendanube.com)

- Go to `Apps page`

- Selected your desired app and the portal will redirect you to its Detail page

- In the details page, there will be a component in which the Partner can register the apps scripts

- Click the `Create script` button, and a form will be displayed.

Observation: If no `Scripts` section is available, there's a high chance that no `scripts` permission was added to the app during its registration, which is required for the scripts feature activation. If that's not the case, please contact Tiendanube's Partner support team.

### Script form properties

- When creating a script, the following fields are required

| Property | Explanation 
| name | A descriptive name that helps members of the partner's organization to identify the script purpose 
| handle | An identifier that will be used to reference the script 
| location | Specifies which page the script will run (store or checkout) 
| event | DOM event which triggers the loading of the script. Valid values are **onfirstinteraction** (default) or **onload** 
| dev mode | This determines whether or not the script is under development and, if so, a development url can be provided so the script is loaded from the developer's local environment 
| development url | Developer's local environment url that references the script 
| script file (optional) | Opens a file browser that allows a javascript file to be uploaded as the script 
| auto installed | This field indicated if the script will be activated automatically for each store upon app installation 

#### Important Rules

- Some fields have a deep impact on how the Script will behave. So lets deep dive into it.

##### Event field

To prevent performance issues, we use two different events where it's possible to attach the script, `onfirstinteraction`, and `onload`.

###### onfirstinteraction Event

The scripts will be loaded and executed after the user's first interaction. A scroll up/down, a mouseclick, or a tap will trigger the event.

This event is intended for functionalities that don't affect the above-the-fold or provide other functionalities that are not needed as soon as possible.

This type of event should be the first choice for most applications.

Some application examples could be chatbots, subscription popups, product wishlists, etc.

###### onload event

The script will be part of the critical path and will be executed as soon as possible on the page load. Its behavior is equivalent to the `window.onload` event.

In most cases this event should be avoided, unless you need to change some critical components above the fold or collect user-related data like behavior or conversions.

**Important:** For the use of **onload** event, it's necessary to previously request approval from [api@nuvemshop.com.br](mailto:api@nuvemshop.com.br).

> This approval is necessary if the script is going to run in the storefront or on both screens (storefront and checkout). It is not required for scripts that only run in checkout.

In this email you must send the functionality of the script and why it should be executed `onload`.
Please include the `APP_ID` and the `APP_NAME` in the email title.
If not approved, the script will be created with the **onfirstinteraction** event.

##### Development mode

Development mode is a new feature that has the purpose of facilitating the app scripts development. It allows developers to define a url (and even parameters) for their script when loading them in a demo store.

Once a script is created with development mode on, it'll automatically be loaded in every demo store that has the app (owner of the script) installed. Even for manual scripts that have not being associated with the store in the public API.

The feature is composed by two fields:

- `Development Url`: url of the development script

- `Development Query Parameters (optional)`: script parameters (for NOT auto-installed scripts)

Both fields will only be visible in the script creation form when the "Development Mode" toggle is active

###### Development Url

The development URL will be an arbitrary value provided by the partner. The developer can create a local server or use a CDN of its choosing, allowing quick updates and high productivity

Examples:

- [http://localhost:3000/my-script.js](http://localhost:3000/my-script.js)

- [https://some-cdn.com/my-script.js](https://some-cdn.com/my-script.js)

##### Development query parameters (Manual Scripts)

- This field is only available for manual scripts as auto installed scripts do not support parameters

- This field accepts a JSON string that will be converted to URL query parameters when the script is loaded in test stores

- Similar to `queryParams` field on the public API activation endpoint

- Example:

Field values:

Development url: `http://localhost:3000/my-script.js`

- Development query parameters: `{"debug": true, "version": "dev"}`

- Result: `http://localhost:3000/my-script.js?debug=true&version=dev`

##### Script file

- `Script file` is optional and can be added later in the script lifecycle when including versions

- If a file is selected in this step, it'll automatically be associated to the script as its first version

##### Auto Installed

If the script is `auto installed`, it'll be automatically activated for each store the script's app is installed. This option is already marked by default as we believe this should be the expected configuration for the majority of scripts use-cases.

However, there are certain scripts that require information outside of Tiendanube's domain, such as the id of the script in the partner's database. When that's the case, the script should `NOT` be auto installed. In this case, an additional step is required for the script to be loaded in the storefront: A request should be sent to Tiendanube's public API to associate the script to each store the app is installed

It's recommended that this step should be executed soon after the app is installed in a certain Merchant store, which means this process is tightly related to our Webhooks feature. When a partner receives a webhook informing that its app was installed in a Merchant store, the partner system should automatically call the scripts POST endpoint in Tiendanube's Public API to associate its parameters to the store.

###### Not auto installed script flow example

Imagine a partner that has an app of id `` and a script id `` associated with it. The script behavior changes based on the Partner's system business rule. Let's say that the partner wants to show a Dialog congratulating the 1000th installation of its app on the Merchant's Storefront. The dialog will be shown if the script is loaded in the storefront given a parameter `showDialog` true.

Let's say that the merchant of id `` is the 1000th installer of our Partner's app. Once the merchant installs the app, the partner will receive a webhook informing the app with id `` was installed in the store ``. The partner's system will then check that this is the 1000th installation, and then it's necessary to send a request to:

```
curl --location 'https://api.tiendanube.com/2025-03//scripts' \--header 'Authentication: bearer ' \--header 'User-Agent: PartnerAppName partner@email.com' \--header 'Content-Type: application/json' \--data '{ "script_id": , "query_params": "{\"showDialog\": true}"}'
```

From this moment on, the script will be loaded in this specific merchant storefront in the following format:

```

```

`Attention: ` even if only the 1000th installation needs this parameter, all other installations should also call the script-store association endpoint for the script to be loaded in the store. The script-store association endpoint also serves as a Partner's agreement that the script can be loaded in the store. So even if no parameters are required, a request needs to be sent authorizing Tiendanube to load the script.

```
curl --location 'https://api.tiendanube.com/2025-03//scripts' \--header 'Authentication: bearer ' \--header 'User-Agent: PartnerAppName partner@email.com' \--header 'Content-Type: application/json' \--data '{ "script_id": , "query_params": "{}"}'
```

- The script will then be loaded in the storefront:

```

```

- As one can see, the process of scripts that are `not auto installed` is considerably more complex than its positive counterpart so our Team recommend that, unless it's absolutely necessary, the scripts should be `auto installed` and depend only on information that is in Tiendanube's domain, which can mostly be accessed by the `LS` object mentioned in the script implementation section.

### Versioning and Deploy

- As explained before, "Scripts" and its "Versions" are considered different elements

- Once a script is defined with its general configurations, versions can be added to it in order to implement the expected behavior

- The actions described in this action can be executed in the Scripts list on App Details page or in the Script detail page (accessed by selecting the "Edit" icon in a single script)

- **IMPORTANT**: In the previous section, we discussed how scripts may have parameters associated with them for each store. A common question might arise: do we need to call the script-association API every time a new version of a script is released? This is only necessary if the new version introduces a new parameter. If the update consists solely of changes unrelated to parameters, no additional action is needed, as parameter associations are tied to the script itself, not to individual versions

#### Adding version

- **Steps**

Select `Add version` button

- Select the desired `.js` file in your machine

- The script will be uploaded and a version will be created

Once the version is added/created, it starts its lifecycle in a `draft` state. The partner is allowed to add as many versions as desired, however only one version at a time can be activated for test stores (deploy test) and in production environment (deploy)

#### Deploy testing

- In every set of `"draft"` script versions, the developer can choose to deploy a specific version to test environment.

script status is then set to `testing` and, if it's `auto installed`, it'll is now be loaded in test stores

OBS: For `scripts that aren't auto installed`, an additional step (script-store association) will be necessary for it to run on the store (the step will be covered later in the document)

**ATTENTION!**: If the script is not auto installed, it's necessary to execute the script-store association endpoint before the scripts starts being loaded in stores even after deploy

#### Deploy

- After the script was successfully tested, the developer can deploy it to the production environment. Its status is set to `active`

- Assuming the script is `auto installed`, it'll then be available in all stores the script's app is installed

- If there was already a previous version in `active` version, it becomes a `legacy` version

**ATTENTION!**: If the script is not auto installed, it's necessary to execute the script-store association endpoint before the scripts starts being loaded in stores even after deploy

#### Rollback

- If a script causes errors in production environment, a previous `"legacy"` version can be chosen to replace the current script as `active`

- In this case, since the `legacy` version had been tested before, it goes directly to `active` status (no need for testing)

## Scripts Public API Endpoints

- The legacy scripts endpoints in the Public API were updated and will not register scripts anymore

- The API is necessary for `NOT auto installed` scripts only, since they will not load on Partner's storefront until the parameters were defined

### Headers

- For all following requests, the following Headers are required

| HEADER | VALUE 
| Authentication | bearer `` 
| User-Agent | partner self identification string with app name and partner email 
| Content-Type | application/json 

- `access_token` is informed by webhooks when a certain store install the Partner's app

From the access token it's verified if the request is allowed to manipulate the script for the informed store

### GET /scripts

#### Parameters

| Parameter | Explanation 
| page | Page to show 
| per_page | Amount of results 

#### Response

`HTTP/1.1 200 OK`

```
{ "result": [ { "id": 12345, "name": "Script name", "event": "onfirstinteraction", "location": "store", "created_at": "2024-09-11T20:19:29.000Z", "updated_at": "2024-09-11T20:20:19.000Z", "is_auto_install": false, "status": "active", "params": { "paramA": 1 }, "current_version": { "id": 22435, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/2.js?versionId=Dbd4FeTBY9ssDVnDaBeaOmXX8a7raJGS", "version": 2 }, "draft_version": { "id": 22437, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/3.js?versionId=RYH33gaBY9ssDVnDaBeaOmXX8ABDAS3g", "version": 3 } }, { "id": 12346, "name": "Another script", "event": "onfirstinteraction", "location": "store", "created_at": "2024-09-12T21:40:29.000Z", "updated_at": "2024-09-12T21:40:29.000Z", "is_auto_install": true, "status": "active", "current_version": { "id": 22456, "src": "https://apps-scripts.tiendanube.com/app-handle/another-script/1.js?versionId=Dbd4FeTBY9ssDVnDaBeaOmXX8a7raJGS", "version": 1 }, "draft_version": null } ], "total": 1}
```

### GET /scripts/{id}

#### Response

`HTTP/1.1 200 OK`

```
{ "id": 12345, "name": "Script name", "event": "onfirstinteraction", "location": "store", "created_at": "2024-09-11T20:19:29.000Z", "updated_at": "2024-09-11T20:20:19.000Z", "is_auto_install": false, "status": "active", "params": { "paramA": 1 }, "current_version": { "id": 22435, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/2.js?versionId=Dbd4FeTBY9ssDVnDaBeaOmXX8a7raJGS", "version": 2 }, "draft_version": { "id": 22437, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/3.js?versionId=RYH33gaBY9ssDVnDaBeaOmXX8ABDAS3g", "version": 3 }}
```

### POST /scripts

- Creates script-store association

- Pre-requisite step for script to be loaded in the desired store

- Only available for scripts defined as "Non-autoinstallable"

#### Request Body

```
{ "script_id": 12345, "query_params": "{\"paramA\": 2}"}
```

#### Response

`HTTP/1.1 201 Created`

```
{ "id": 12345, "name": "Script name", "event": "onfirstinteraction", "location": "store", "created_at": "2024-09-11T20:19:29.000Z", "updated_at": "2024-09-11T20:20:19.000Z", "is_auto_install": false, "status": "active", "params": { "paramA": 2 }, "current_version": { "id": 22435, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/2.js?versionId=Dbd4FeTBY9ssDVnDaBeaOmXX8a7raJGS", "version": 2 }, "draft_version": { "id": 22437, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/3.js?versionId=RYH33gaBY9ssDVnDaBeaOmXX8ABDAS3g", "version": 3 }}
```

### PUT /scripts/{id}

- Modifies an existing script-store association (parameters)

- Only available for scripts defined as "Non-autoinstallable"

#### Request Body

```
{ "script_id": 12345, "query_params": "{\"paramA\": 3}"}
```

#### Response

`HTTP/1.1 200 OK`

```
{ "id": 12345, "name": "Script name", "event": "onfirstinteraction", "location": "store", "created_at": "2024-09-11T20:19:29.000Z", "updated_at": "2024-09-11T20:20:19.000Z", "is_auto_install": false, "status": "active", "params": { "paramA": 3 }, "current_version": { "id": 22435, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/2.js?versionId=Dbd4FeTBY9ssDVnDaBeaOmXX8a7raJGS", "version": 2 }, "draft_version": { "id": 22437, "src": "https://apps-scripts.tiendanube.com/app-handle/script-name/3.js?versionId=RYH33gaBY9ssDVnDaBeaOmXX8ABDAS3g", "version": 3 }}
```

### DELETE /scripts/{id}

- Removes script association with store

Script stops being loaded in informed store

- Only available for scripts defined as "Non-autoinstallable"

#### Response

`HTTP/1.1 200 OK`

```
{}
```