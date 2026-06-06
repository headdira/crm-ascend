---
title: Pages
source: https://tiendanube.github.io/api-documentation/resources/page
version: 2025-03
---

# Pages

## Overview

The **Pages resource** allows developers to manage custom pages within the store. The resource also handles stores with multiple languages. Currently, a Page is always in a published state, meaning that it will always be visible on the store.

Since: `2025-03`

### Page Properties

| Field | Type | Description 
| `id` | Integer | Unique identifier of the page. 
| `store_id` | Integer | ID of the store this page belongs to. 
| `published` | Boolean | Whether the page is currently published. 
| `created_at` | String | Timestamp when the page was created (ISO 8601 format). 
| `updated_at` | String | Timestamp when the page was last updated (ISO 8601 format). 
| `name` | Object | Localized name of the page. Keys are language codes (e.g., "es"). 
| `handle` | Object | Localized URL-friendly handle/slug for the page. Keys are language codes (e.g., "es"). 
| `content` | Object | Localized HTML content of the page. Keys are language codes (e.g., "es"). 
| `seo_title` | Object | Localized SEO title for the page. Keys are language codes (e.g., "es"). 
| `seo_description` | Object | Localized SEO description for the page. Keys are language codes (e.g., "es"). 

## Endpoints

### Retrieve All Pages

#### GET /pages

Retrieves all custom pages from the store.

**Permissions Required:** `read_content`

**Response:**

```
{ "pages": { "results": [ { "id": 105034, "store_id": 97906, "published": true, "created_at": "2025-02-25T19:19:06+0000", "updated_at": "2025-02-25T19:44:06+0000", "name": { "es": "About Us" }, "handle": { "es": "about-us" }, "content": { "es": "

Our company was founded in 2020...
" }, "seo_title": { "es": "About Our Company" }, "seo_description": { "es": "Learn more about our company's history and mission" } } ], "total": 17, "page": 1, "perPage": 5, "lastPage": 4 }}
```

**Response Fields:**

- `pages.results`: Array of page objects

- `pages.total`: Total number of pages available

- `pages.page`: Current page number

- `pages.perPage`: Number of pages per page

- `pages.lastPage`: Total number of pages

### Retrieve a Specific Page

#### GET /pages/:pageID

Retrieves a specific custom page by its ID.

**Permissions Required:** `read_content`

**Path Parameters:**

- `pageID` (integer) - The unique identifier of the page.

**Response:**

```
{ "id": 1658539, "store_id": 1898952, "published": true, "created_at": "2023-10-10T18:29:09+0000", "updated_at": "2024-07-19T20:13:48+0000", "name": { "es": "A Phishing Page", "en": "A Phishing Page" }, "handle": { "es": "a-phishing-page", "en": "a-phishing-page" }, "content": { "es": "\r\nEn la misma semana en la que el Gobierno Nacional, a través de la Inspección General de Justicia, habilitó las Sociedades Anónimas Deportivas en el fútbol, la AFA, luego de una reunión de Comité Ejecutivo junto al de la Liga Profesional en el predio de Ezeiza, tuvo una fuerte respuesta.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nEl comunicado fue titulado así: \"Aclaración sobre la inalterabilidad del Estatuto de AFA frente a los supuestos cambios introducidos por cierta normativa en materia de Sociedades Anónimas Deportivas\". En un extenso texto, aclara lo que considera \"la tergiversada interpretación realizada por ciertos medios de comunicación masivos\".\r\n\r\n\r\nY se explica: \"En efecto, destacamos que dichas modificaciones dictadas por el organismo local de la Ciudad de Buenos Aires no obligan ni inciden en forma alguna en el estatuto social de la AFA, continuando, siendo un requisito indispensable para ser miembro de AFA el ser una 'Asociación Civil sin fines de lucro', tal como lo decidieron libremente las entidades miembros de AFA. En este punto, resulta una buena ocasión para aclarar que, AFA ni sus entidades miembros se encuentran en oposición a las llamadas SAD (Sociedades Anónimas Deportivas) y/o a que cada asociación civil (club, sea cual fuere su actividad) pueda decidir libremente la estructura jurídica a adoptar; ahora bien, a lo que sí se opone AFA y sus entidades miembros, puesto que es palmariamente inconstitucional, es que se quiera obligar a cualquier ente privado (la AFA y cualquier asociación civil, lo es) a asociar a entidades con diferente estructura jurídica a la de sus actuales miembros en clara oposición a sus estatutos conforme así lo establecieron sus socios.\r\n", "en": "

dadasd
\r\n" }, "seo_title": { "es": "A Phishing Page", "en": "A Phishing Page" }, "seo_description": { "es": "", "en": "" }}
```

### Create a New Page

#### POST /pages

Creates a new custom page in the store.

**Permissions Required:** `write_content`

**Request Body:**

```
{ "page": { "publish": true, "i18n": { "es_AR": { "title": "About Us", "content": "

Our company was founded in 2020...
", "seo_handle": "about-us", "seo_title": "About Our Company", "seo_description": "Learn more about our company" }, "en_US": { "title": "About Us", "content": "

Our company was founded in 2020...
", "seo_handle": "about-us", "seo_title": "About Our Company", "seo_description": "Learn more about our company" } } }}
```

**Request Body Fields:**

- `page.publish` (boolean): Whether the page should be published immediately

- `page.i18n` (object): Localized content for each language

Each language key (e.g., "es_AR", "en_US") contains:

`title`: The page title

- `content`: HTML content of the page

- `seo_handle`: URL-friendly handle for the page

- `seo_title`: SEO title for the page

- `seo_description`: SEO description for the page

**Response:**

```
{ "id": 105051, "store_id": 97906, "published": true, "created_at": "2025-03-20T15:29:56+0000", "updated_at": "2025-03-20T15:29:56+0000", "name": { "en_US": "About Us", "es_AR": "About Us" }, "handle": { "en_US": "about-us", "es_AR": "about-us" }, "content": { "en_US": "

Our company was founded in 2020...
", "es_AR": "

Our company was founded in 2020...
" }, "seo_title": { "en_US": "About Our Company", "es_AR": "About Our Company" }, "seo_description": { "en_US": "Learn more about our company", "es_AR": "Learn more about our company" }}
```

### Update an Existing Page

#### PUT /pages/:pageID

Updates an existing custom page by its ID.

**Permissions Required:** `write_content`

**Path Parameters:**

- `pageID` (integer) - The unique identifier of the page.

**Request Body:**

```
{ "title": "About Us (Updated)", "content": "Updated content for About Us page."}
```

**Response:**

```
{ "id": 1541092, "store_id": 2101462, "published": true, "created_at": "2025-03-20T18:56:58+0000", "updated_at": "2025-03-20T18:57:12+0000", "name": { "es": "We are The testers" }, "handle": { "es": "test" }, "content": { "es": "

Testxcvssszxcxzcsssssss
" }, "seo_title": { "es": "asd" }, "seo_description": { "es": "asd" }}
```

### Delete a Page

#### DELETE /pages/:pageID

Deletes a specific custom page from the store.

**Permissions Required:** `write_content`

**Path Parameters:**

- `pageID` (integer) - The unique identifier of the page.

**Response:**

```
{ "message": "Page deleted successfully."}
```

**Error Response (If Page ID Does Not Exist):**

```
{ "code": 404, "message": "Not Found", "description": "Page not found"}
```