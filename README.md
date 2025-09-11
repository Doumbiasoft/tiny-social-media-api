# 📱 Tiny Social Media API

## 🚀 Overview

A RESTful API for a social media platform built with Express.js, TypeScript, and EJS templating. The API provides endpoints for managing users, posts, and comments, along with web views for content creation and display.

## ✨ Features

- **🔗 RESTful API**: Full CRUD operations for users, posts, and comments
- **🎨 Web Views**: Beautiful EJS templates with Tailwind CSS
- **📚 Auto Documentation**: Swagger/OpenAPI documentation generation
- **🛡️ Type Safety**: Built with TypeScript
- **✅ Validation**: Request validation with detailed error messages
- **📱 Modern UI**: Responsive design with Tailwind CSS v4

## 🚀 Quick Start

### 📦 Installation

```bash
npm install
```

### ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost

```

**Note**: The application will use default values if no `.env` file is provided.

### 🔧 Development

```bash
npm run dev
```

### 🏗️ Build

```bash
npm run build
```

### 🚀 Production

```bash
npm start
```

## 🌐 Base URL

```
http://localhost:PORT/api
```

## 🔗 API Endpoints

### 👥 Users (`/api/v1/users`)

#### GET `/api/v1/users`

- **Description**: Retrieve all users
- **Response**: Array of user objects
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    }
  ]
}
```

#### GET `/api/v1/users/:id`

- **Description**: Retrieve a specific user by ID
- **Parameters**:
  - `id` (number): User ID
- **Response**: User object or 404 if not found

#### GET `/api/v1/users/:id/posts`

- **Description**: Retrieve all posts created by a specific user
- **Parameters**:
  - `id` (number): User ID
- **Response**: Array of posts created by the user

#### GET `/api/v1/users/:id/comments`

- **Description**: Retrieve all comments made by a specific user
- **Parameters**:
  - `id` (number): User ID
- **Response**: Array of comments made by the user

#### GET `/api/v1/users/:id/comments?postId={postId}`

- **Description**: Retrieve comments by a specific user filtered by post
- **Parameters**:
  - `id` (number): User ID
- **Query Parameters**:
  - `postId` (number, required): Filter comments by specific post ID
- **Response**: Array of comments made by the user on the specified post

#### POST `/api/v1/users`

- **Description**: Create a new user
- **Request Body**:

```json
{
  "name": "string (required, 3-50 chars)",
  "username": "string (required, 3-50 chars, unique)",
  "email": "string (required, valid email format)"
}
```

- **Response**: Created user object with generated ID

#### PATCH `/api/v1/users/:id`

- **Description**: Update an existing user
- **Parameters**:
  - `id` (number): User ID
- **Request Body**:

```json
{
  "id": "number (required, must match URL parameter)",
  "name": "string (optional)",
  "username": "string (optional)",
  "email": "string (optional)"
}
```

- **Response**: Updated user object

#### DELETE `/api/v1/users/:id`

- **Description**: Delete a user
- **Parameters**:
  - `id` (number): User ID
- **Response**: Success confirmation

### 📝 Posts (`/api/v1/posts`)

#### GET `/api/v1/posts`

- **Description**: Retrieve all posts with user information
- **Response**: Array of post objects with embedded user data

#### GET `/api/v1/posts?userId={userId}`

- **Description**: Retrieve posts filtered by specific user
- **Query Parameters**:
  - `userId` (number, required): Filter posts by specific user ID
- **Response**: Array of post objects for the specified user
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "My First Post",
      "content": "This is the content of my post"
    }
  ]
}
```

#### GET `/api/v1/posts/:id`

- **Description**: Retrieve a specific post by ID
- **Parameters**:
  - `id` (number): Post ID
- **Response**: Post object with user information

#### GET `/api/v1/posts/:id/comments`

- **Description**: Retrieve all comments for a specific post
- **Parameters**:
  - `id` (number): Post ID
- **Response**: Array of comments for the post

#### GET `/api/v1/posts/:id/comments?userId={userId}`

- **Description**: Retrieve comments for a specific post filtered by user
- **Parameters**:
  - `id` (number): Post ID
- **Query Parameters**:
  - `userId` (number, required): Filter comments by specific user ID
- **Response**: Array of comments for the post from the specified user

#### POST `/api/v1/posts`

- **Description**: Create a new post
- **Request Body**:

```json
{
  "userId": "number (required)",
  "title": "string (required)",
  "content": "string (required)"
}
```

- **Response**: Created post object

#### PATCH `/api/v1/posts/:id`

- **Description**: Update an existing post
- **Parameters**:
  - `id` (number): Post ID
- **Request Body**:

```json
{
  "id": "number (required, must match URL parameter)",
  "title": "string (optional)",
  "content": "string (optional)"
}
```

- **Response**: Updated post object

#### DELETE `/api/v1/posts/:id`

- **Description**: Delete a post
- **Parameters**:
  - `id` (number): Post ID
- **Response**: Success confirmation

### 💬 Comments (`/api/v1/comments`)

#### GET `/api/v1/comments`

- **Description**: Retrieve all comments with user and post information
- **Response**: Array of comment objects with embedded user and post data

#### GET `/api/v1/comments?userId={userId}`

- **Description**: Retrieve comments filtered by specific user
- **Query Parameters**:
  - `userId` (number, required): Filter comments by specific user ID
- **Response**: Array of comments made by the specified user

#### GET `/api/v1/comments?postId={postId}`

- **Description**: Retrieve comments filtered by specific post
- **Query Parameters**:
  - `postId` (number, required): Filter comments by specific post ID
- **Response**: Array of comments for the specified post

#### GET `/api/v1/comments?userId={userId}&postId={postId}`

- **Description**: Retrieve comments filtered by both user and post
- **Query Parameters**:
  - `userId` (number, required): Filter comments by specific user ID
  - `postId` (number, required): Filter comments by specific post ID
- **Response**: Array of comments made by the specified user on the specified post
- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "postId": 1,
      "body": "This is a great post!"
    }
  ]
}
```

#### GET `/api/v1/comments/:id`

- **Description**: Retrieve a specific comment by ID
- **Parameters**:
  - `id` (number): Comment ID
- **Response**: Comment object with user and post information

#### POST `/api/v1/comments`

- **Description**: Create a new comment
- **Request Body**:

```json
{
  "userId": "number (required)",
  "postId": "number (required)",
  "body": "string (required)"
}
```

- **Response**: Created comment object

#### PATCH `/api/v1/comments/:id`

- **Description**: Update an existing comment
- **Parameters**:
  - `id` (number): Comment ID
- **Request Body**:

```json
{
  "id": "number (required, must match URL parameter)",
  "body": "string (required)"
}
```

- **Response**: Updated comment object

#### DELETE `/api/v1/comments/:id`

- **Description**: Delete a comment
- **Parameters**:
  - `id` (number): Comment ID
- **Response**: Success confirmation

## 🖥️ Web Views (`/api/v1/views`)

### 📋 Posts List View

![Posts List View](./src/assets/images/tiny-social-media-web-view.png)
**URL**: `/api/v1/views/posts`
**Method**: GET

#### Features:

- **Responsive Design**: Mobile-first layout with Tailwind CSS
- **Modern UI**: Card-based post layout with shadows and hover effects
- **User Information**: Displays user avatar, name, and email for each post
- **Post Details**: Shows post title, content, and ID
- **Navigation**: Sticky header with post counter and "Create Post" button
- **Empty State**: Elegant message when no posts exist
- **Footer**: Branded footer with copyright information

### ✏️ Add Post Form View

**URL**: `/api/v1/views/add-post`
**Method**: GET

#### Features:

- **Clean Form Design**: Professional form layout with proper spacing
- **User Selection**: Dropdown to select from existing users
- **Form Validation**: Required field validation
- **Responsive Layout**: Works on all screen sizes
- **Navigation**: Link back to posts list

#### Form Submission:

**URL**: `/api/v1/views/posts`
**Method**: POST
**Redirect**: Redirects to posts list after successful creation

#### Form Fields:

- **User Selection**: Dropdown populated with all users
- **Post Title**: Text input with placeholder
- **Content**: Textarea for post content
- **Submit Button**: Styled button with icon

## 📖 Documentation

### 📚 API Documentation

- **Swagger UI**: Available at baseURl + `/swagger`
- **Scalar UI**: Available at baseURl + `/docs`
- **OpenAPI Spec**: Available at baseURl + `/api-docs`

### ⚡ Features

- **🤖 Automatic Documentation**: Generated from controller decorators
- **🧪 Interactive Testing**: Test endpoints directly from the documentation
- **✅ Schema Validation**: Request/response validation with detailed error messages
- **📝 Logging**: Request logging with Morgan middleware
- **🚨 Error Handling**: Global error handler with consistent response format

## 🛠️ Technology Stack

- **⚙️ Backend**: Express.js with TypeScript
- **🖼️ Templating**: EJS for server-side rendering
- **🎨 Styling**: Tailwind CSS v4 (CDN) and embedded style.css
- **📖 Documentation**: @reflet/express for automatic OpenAPI generation
- **✅ Validation**: Custom validation middleware
- **🔧 Development**: tsx for development server

## 📤 Response Format

All API responses follow a consistent format:

### ✅ Success Response:

```json
{
  "success": true,
  "data": "...",
  "message": "Optional success message"
}
```

### ❌ Error Response:

```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

## ✅ Validation

- **🔍 Request Body Validation**: Automatic validation with detailed error messages
- **🔧 Type Checking**: Ensures correct data types for all fields
- **📋 Required Fields**: Enforces required field validation
- **🚨 Error Responses**: Returns 400 status with validation details

## 📂 Project Structure

```
tiny-social-media-api/
├── package.json              # Dependencies and scripts
├── README.md                # Project documentation
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── src/
    ├── app.ts               # Express app configuration
    ├── server.ts           # Server entry point
    ├── controllers/        # Route controllers
    │   └── v1/            # API version 1 controllers
    │       ├── comment.controller.ts    # Comment CRUD operations
    │       ├── post.controller.ts       # Post CRUD operations
    │       ├── user.controller.ts       # User CRUD operations
    │       └── views.controller.ts      # Web view controllers
    ├── middlewares/        # Custom middleware
    │   ├── endpointMetadata.middleware.ts   # OpenAPI metadata
    │   ├── globalErrorHandler.middleware.ts # Error handling
    │   ├── logging.middleware.ts            # Request logging
    │   └── validation.middleware.ts         # Request validation
    ├── routes/            # Route registration
    │   ├── index.ts       # Main route registry
    │   └── v1/
    │       └── index.ts   # V1 route configuration
    ├── services/          # Business logic layer
    │   ├── comment.service.ts   # Comment business logic
    │   ├── post.service.ts      # Post business logic
    │   └── user.service.ts      # User business logic
    ├── types/             # TypeScript type definitions
    │   ├── apiResponseInterface.ts  # API response types
    │   └── httpStatus.ts           # HTTP status codes
    ├── utils/             # Utility functions
    │   ├── apiResponseFormat.ts    # Response formatting
    │   ├── AppError.ts            # Custom error class
    │   ├── logger.ts              # Winston logger setup
    │   └── openAPIDocsGenerator.ts # Auto API docs generation
    ├── config/            # Configuration files
    │   ├── apiPrefix.ts   # API route prefixes
    │   ├── database.ts    # In-memory database
    │   └── env.ts         # Environment variables
    ├── views/             # EJS templates
    │   ├── add-post.ejs   # Post creation form
    │   └── posts-list.ejs # Posts display page
    └── assets/            # Static assets
        ├── styles/        # CSS files
        │   └── styles.css # Custom styles
        └── images/        # Image files
            └── user.png   # Default user avatar
```

### Key Configuration Features:

- **🎯 Target**: ES2020 for modern JavaScript features
- **📦 Module**: CommonJS for Node.js compatibility
- **📁 Directories**: Source in `src/`, output in `dist/`
- **🔒 Strict Mode**: Full TypeScript strict checking enabled
- **🎭 Decorators**: Experimental decorators for @reflet/express
- **📋 Includes**: Only compiles files in `src/` directory

## 🤔 Project Reflection

### Were there any requirements that were difficult to implement? What do you think would make them easier to implement in future projects?

The most challenging aspects of this project were:

**🎨 EJS Templating & Form Integration**

- Setting up proper form validation between EJS templates and backend controllers required careful attention to field naming and data type conversion
- The userId string-to-number conversion issue highlighted the need for better middleware for automatic type coercion

**🔗 View Controller Architecture**

- Creating a separate views controller while maintaining clean separation from API controllers required thoughtful route organization
- Ensuring proper data flow between form submissions and redirects needed careful planning
- Future improvement: Use a more robust templating framework like React better component reusability

### What would you add to or change about your application if given more time?

**💾 Persistent Data Storage**

- Replace the in-memory database with a real database (PostgreSQL or MongoDB) for data persistence

**🔐 Authentication & Authorization**

- Add user authentication with JWT tokens or session-based auth
- Implement role-based access control (admin, user roles)
- Add password hashing and secure login/logout functionality
