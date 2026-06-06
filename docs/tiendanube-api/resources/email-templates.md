---
title: Email Templates
source: https://tiendanube.github.io/api-documentation/resources/email-templates
version: 2025-03
---

# Email Templates

## Overview

The **Email Templates resource** allows merchants to customize the email notifications sent to their customers. These templates control the content and appearance of various automated emails, including order confirmations, shipping notifications, password resets, and more. Each template can be configured with both plain text and HTML versions, and supports multiple languages through localization.

Since: `2025-03`

### Email Template Properties

| Field | Type | Description 
| `id` | Integer | Unique identifier of the email template. 
| `type` | String | Type of the email template. Possible values are: 
| | | - `abandonedcheckoutrecover`: Template for recovering abandoned checkouts 
| | | - `customer_activate_account`: Template for customer account activation 
| | | - `customer_reset_password`: Template for password reset requests 
| | | - `customer_welcome_account`: Template for welcoming new customers 
| | | - `ordercancelled`: Template for cancelled orders 
| | | - `ordercaptured`: Template for captured orders 
| | | - `orderconfirmation`: Template for order confirmation 
| | | - `ordershipped`: Template for shipped orders 
| `html_enabled` | Boolean | Whether the template supports HTML content. 
| `subject` | Object | Localized subject line of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages. 
| `template_text` | Object | Localized plain text content of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages. 
| `template_html` | Object | Localized HTML content of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages. 

## Endpoints

### Retrieve All Email Templates

#### GET /email-templates

Retrieves all email templates from the store. This endpoint does not support pagination.

**Permissions Required:** `read_email_templates`

**Response:**

```
[ { "id": 80946, "type": "abandonedcheckoutrecover", "html_enabled": true, "subject": { "es": "Recupera tu carrito abandonado", "pt": "Recupere seu carrinho abandonado" }, "template_text": { "es": "Has dejado algunos productos en tu carrito...", "pt": "Você deixou alguns produtos no seu carrinho..." }, "template_html": { "es": "

Has dejado algunos productos en tu carrito...
", "pt": "

Você deixou alguns produtos no seu carrinho...
" } }, { "id": 80947, "type": "customer_activate_account", "html_enabled": true, "subject": { "es": "Activa tu cuenta", "pt": "Ative sua conta" }, "template_text": { "es": "Gracias por registrarte. Por favor, activa tu cuenta...", "pt": "Obrigado por se registrar. Por favor, ative sua conta..." }, "template_html": { "es": "

Gracias por registrarte. Por favor, activa tu cuenta...
", "pt": "

Obrigado por se registrar. Por favor, ative sua conta...
" } }, { "id": 80948, "type": "customer_reset_password", "html_enabled": true, "subject": { "es": "Restablece tu contraseña", "pt": "Redefina sua senha" }, "template_text": { "es": "Has solicitado restablecer tu contraseña...", "pt": "Você solicitou redefinir sua senha..." }, "template_html": { "es": "

Has solicitado restablecer tu contraseña...
", "pt": "

Você solicitou redefinir sua senha...
" } }, { "id": 80949, "type": "customer_welcome_account", "html_enabled": true, "subject": { "es": "¡Bienvenido a nuestra tienda!", "pt": "Bem-vindo à nossa loja!" }, "template_text": { "es": "Gracias por crear tu cuenta...", "pt": "Obrigado por criar sua conta..." }, "template_html": { "es": "

Gracias por crear tu cuenta...
", "pt": "

Obrigado por criar sua conta...
" } }, { "id": 80950, "type": "ordercancelled", "html_enabled": true, "subject": { "es": "Tu orden ha sido cancelada", "pt": "Seu pedido foi cancelado" }, "template_text": { "es": "Tu orden ha sido cancelada...", "pt": "Seu pedido foi cancelado..." }, "template_html": { "es": "

Tu orden ha sido cancelada...
", "pt": "

Seu pedido foi cancelado...
" } }, { "id": 80951, "type": "ordercaptured", "html_enabled": true, "subject": { "es": "Tu pago ha sido capturado", "pt": "Seu pagamento foi capturado" }, "template_text": { "es": "Tu pago ha sido capturado exitosamente...", "pt": "Seu pagamento foi capturado com sucesso..." }, "template_html": { "es": "

Tu pago ha sido capturado exitosamente...
", "pt": "

Seu pagamento foi capturado com sucesso...
" } }, { "id": 80952, "type": "orderconfirmation", "html_enabled": true, "subject": { "es": "¡Tu orden ha sido confirmada!", "pt": "Seu pedido foi confirmado!" }, "template_text": { "es": "Gracias por tu compra. Tu orden ha sido confirmada...", "pt": "Obrigado pela sua compra. Seu pedido foi confirmado..." }, "template_html": { "es": "

Gracias por tu compra. Tu orden ha sido confirmada...
", "pt": "

Obrigado pela sua compra. Seu pedido foi confirmado...
" } }, { "id": 80953, "type": "ordershipped", "html_enabled": true, "subject": { "es": "¡Tu orden ha sido enviada!", "pt": "Seu pedido foi enviado!" }, "template_text": { "es": "Tu orden ha sido enviada. Aquí están los detalles...", "pt": "Seu pedido foi enviado. Aqui estão os detalhes..." }, "template_html": { "es": "

Tu orden ha sido enviada. Aquí están los detalles...
", "pt": "

Seu pedido foi enviado. Aqui estão os detalhes...
" } }]
```

**Response Fields:**

- Array of email template objects, one for each template type

### Retrieve a Specific Email Template

#### GET /email-templates/:templateID

Retrieves a specific email template by its ID.

**Permissions Required:** `read_email_templates`

**Path Parameters:**

- `templateID` (integer) - The unique identifier of the email template.

**Response:**

```
{ "id": 80946, "type": "abandonedcheckoutrecover", "html_enabled": true, "subject": { "es": "Asunto en Español", "pt": "Assunto em Português" }, "template_text": { "es": "Plantilla de texto en Español", "pt": "Modelo de texto em Português" }, "template_html": { "es": "

Plantilla HTML en Español
", "pt": "

Modelo HTML em Português
" }}
```

### Update an Email Template

#### PUT /email-templates/:templateID

Updates an existing email template by its ID.

**Permissions Required:** `write_email_templates`

**Path Parameters:**

- `templateID` (integer) - The unique identifier of the email template.

**Request Body:**

```
{ "html_enabled": true, "subject": { "es": "Asunto en Español", "pt": "Assunto em Português" }, "template_html": { "es": "

Plantilla HTML en Español
", "pt": "

Modelo HTML em Português
" }, "template_text": { "es": "Plantilla de texto en Español", "pt": "Modelo de texto em Português" }}
```

**Request Body Fields:**

- `html_enabled` (boolean): Whether the template supports HTML content

- `subject` (object): Localized subject line of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages.

- `template_html` (object): Localized HTML content of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages.

- `template_text` (object): Localized plain text content of the email. Keys are language codes (e.g., "es", "en", "pt"). You can include any combination of these languages.

**Response:**

```
{ "html_enabled": true, "subject": { "es": "Asunto en Español", "pt": "Assunto em Português" }, "template_html": { "es": "

Plantilla HTML en Español
", "pt": "

Modelo HTML em Português
" }, "template_text": { "es": "Plantilla de texto en Español", "pt": "Modelo de texto em Português" }}
```

**Error Response (If Template ID Does Not Exist):**

```
{ "code": 404, "message": "Not Found", "description": "Email template not found"}
```