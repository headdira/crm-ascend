---
title: Blog
source: https://tiendanube.github.io/api-documentation/resources/blog
version: 2025-03
---

# Blog

## Introduction

The Blog API allows you to manage your store's blog content, offering full functionality for creating, editing, and publishing posts.

### Key Features

- Create and manage blog posts

- Control publication status (publish or unpublish posts)

- Manage SEO metadata, including titles, descriptions, and custom profiles

- Upload and organize images within blog post content

- Add and manage cover images (thumbnails) for blog posts

## Required Permissions

To use the Blog API, your application must have the following permissions activated in the Partner Panel:

- **Edit Content** - Allows modifying and creating blog content

- **Read Content** - Allows reading blog content

Make sure these permissions are enabled before attempting to use the Blog API endpoints.

## Core Concepts

### Blog

A content management system integrated into the store that enables merchants to create, manage, and publish articles, news, and other types of content to engage and inform their customers.

### Blog Post

An individual piece of content within a blog. Each post includes:

- Rich HTML content with embedded images and media

- SEO metadata (title, description, handle)

- Publication status

- Cover image (thumbnail)

- Multi-language support

### Cover Image (Thumbnail)

The main representative image for a blog post, displayed in post listings, previews, and social media shares.

## Blog Management

Retrieve your store's blog information, including the blog ID required for all other Blog API operations.

### Endpoints

#### GET /blogs

Retrieves the blog associated with the store.

Response

```
{ "blog_id": "019a0baf-d644-755c-aa03-843c92af7047", "owner": { "id": "string" }}
```

Error Responses

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog not found

## Blog Post Management

Blog posts are the main content of your blog. They allow stores to create engaging articles with rich HTML content, images, and SEO-optimized metadata.

### Endpoints

#### GET /blogs/{blog_id}/posts

Retrieves a paginated list of blog posts for a specific blog.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog to retrieve posts from 

**Query Parameters:**

| Parameter | Type | Description 
| `page` | number | Page number for pagination (default: 1) 
Response

```
{ "posts": { "data": [ { "blog_id": "string", "post_id": "string", "created_at": "datetime", "updated_at": "datetime", "published_at": "datetime|null", "thumbnail": "string", "data": [ { "language": "string", "title": "string", "handle": "string", "summary": "string", "seo_title": "string", "seo_description": "string", "content": "string" } ], "author": { "id": "string", "name": "string" } } ], "meta": { "page": "number", "take": "number", "itemCount": "number", "pageCount": "number", "previousPage": "number|null", "nextPage": "number|null" } }}
```

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog not found

#### GET /blogs/{blog_id}/posts/{post_id}

Retrieves a specific blog post by its ID.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog containing the post 
| `post_id` | string | ID of the specific post to retrieve 
Response

```
{ "blog_id": "string", "post_id": "string", "created_at": "datetime", "updated_at": "datetime", "published_at": "datetime|null", "thumbnail": "string", "data": [ { "language": "string", "title": "string", "handle": "string", "summary": "string", "seo_title": "string", "seo_description": "string", "content": "string" } ], "author": { "id": "string", "name": "string" }}
```

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Post ID must be a UUID

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog not found

- `404 Not Found` - Post not found

#### POST /blogs/{blog_id}/posts

Creates a new blog post with rich content and metadata.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog where the post will be created 

**Request Body (multipart/form-data):**

| Parameter | Type | Description 
| `metadata` | string | JSON string containing post metadata. Must include a non-empty "language" field along with title, summary, seo_title, seo_description, and handle 
| `content` | string | Rich HTML content of the blog post, including any embedded images (optional) 
| `published` | boolean | Indicates whether the post should be published immediately (optional, default: false) 
| `thumbnail` | string | URL of the cover image representing the blog post (optional) 
Response

```
{ "post_id": "string"}
```

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Invalid metadata format or missing required fields

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog not found

#### PUT /blogs/{blog_id}/posts/{post_id}

Updates an existing blog post with new content and metadata.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog containing the post 
| `post_id` | string | ID of the post to update 

**Request Body (multipart/form-data):**

| Parameter | Type | Description 
| `metadata` | string | JSON string containing updated post metadata. Must include a non-empty "language" field along with title, summary, seo_title, seo_description, and handle 
| `content` | string | Updated rich HTML content of the blog post with embedded images and media (optional) 
| `published` | boolean | Updated publication status (optional) 
| `thumbnail` | string | Updated cover image URL (optional) 
Response

**204 No Content** - Post updated successfully

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Post ID must be a UUID

- `400 Bad Request` - Invalid metadata format or missing required fields

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog not found

- `404 Not Found` - Post not found

#### DELETE /blogs/{blog_id}/posts/{post_id}

Permanently deletes a blog post and all associated data.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog containing the post 
| `post_id` | string | ID of the post to delete 
Response

**204 No Content** - Post deleted successfully

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Post ID must be a UUID

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog or post not found

## Publication Control

Manage the visibility of your blog posts by choosing whether to publish or unpublish them. Published posts are visible to your audience, while unpublished ones remain saved as drafts.

### Endpoints

#### PATCH /blogs/{blog_id}/posts/{post_id}/publish

Publishes a blog post, making it visible to customers.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog containing the post 
| `post_id` | string | ID of the post to publish 
Response

**204 No Content** - Post published successfully

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Post ID must be a UUID

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog or post not found

#### PATCH /blogs/{blog_id}/posts/{post_id}/unpublish

Unpublishes a blog post, hiding it from public view while keeping it as a draft.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog containing the post 
| `post_id` | string | ID of the post to unpublish 
Response

**204 No Content** - Post unpublished successfully

Error Responses

- `400 Bad Request` - Blog ID must be a UUID

- `400 Bad Request` - Post ID must be a UUID

- `401 Unauthorized` - Invalid or missing authentication token

- `404 Not Found` - Blog or post not found

## Upload Management

Upload and manage images for your blog posts, including content and cover images. Content images help illustrate and enrich your articles, while cover images give your posts a strong visual identity that attracts readers.

### Endpoints

#### POST /blogs/{blog_id}/posts/media

Uploads images for use within blog post content.

**Important:** This endpoint only returns the URL of the uploaded file. You must immediately use this URL in the HTML content of your blog post.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog where media will be uploaded 

**Request Body (multipart/form-data):**

| Parameter | Type | Description 
| `media` | file | Image file to use as content image 
Response

```
{ "media_url": "string"}
```

⚠️ **Note:** The returned `media_url` must be used later in a PUT request to `/blogs/{blog_id}/posts/{post_id}`. Use it inside the `content` parameter as part of the HTML body, inserting the image URL.

Error Responses

- `400 Bad Request` - Problems parsing request body or invalid file format

- `401 Unauthorized` - Invalid or missing authentication token

- `415 Unsupported Media Type` - Blog ID must be a UUID

#### POST /blogs/{blog_id}/posts/thumbnail

Uploads the main or cover image for a blog post.

**Important:** This endpoint only returns the URL of the uploaded file. You must immediately use this URL to update the blog post with the new thumbnail.

**URL Parameters:**

| Parameter | Type | Description 
| `blog_id` | string | ID of the blog where thumbnail will be uploaded 

**Request Body (multipart/form-data):**

| Parameter | Type | Description 
| `image` | file | Image file to use as cover image 
Response

```
{ "thumbnail_url": "string"}
```

⚠️ **Note:** The returned `thumbnail_url` must be used later in a PUT request to `/blogs/{blog_id}/posts/{post_id}`. Use it inside the `thumbnail` parameter to associate the image with a specific blog post.

Error Responses

- `400 Bad Request` - Problems parsing request body or invalid file format

- `401 Unauthorized` - Invalid or missing authentication token

- `415 Unsupported Media Type` - Blog ID must be a UUID

## Final Notes

When using the Blog API, follow these best practices:

- Handle errors gracefully and inform users when operations fail.

- Optimize and validate images to ensure fast loading and proper display (JPEG for photos, PNG for transparency).

- Respect file size limits (recommended: ≤500 KB; up to 1024×1024 px for square and 1024×1800 px for rectangular images).

- Validate HTML content before submission to ensure correct formatting and embedded media.

- Include descriptive metadata (SEO title and description) to improve search visibility.

- Test posts across devices and browsers to confirm consistent rendering.

- Manage publication status carefully — unpublished posts remain as drafts and are not visible to readers.