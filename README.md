<div align="center">

# 🔐 Robust Authentication & Authorization API

An enterprise-grade, production-ready Authentication and Authorization RESTful API built with **Node.js**, **Express 5**, **MongoDB (Mongoose)**, **JWT (Access & Refresh Tokens)**, and **Bcrypt**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Dual_Tokens-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture--folder-structure">Architecture</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment</a>
</p>

</div>

---

## 🌟 Features

- 🛡️ **Dual-Token Authentication**: Short-lived Access Tokens (15m) + Long-lived Refresh Tokens (7d).
- 🔄 **Refresh Token Rotation**: Automatic token refresh and revocation handling.
- 🚪 **Secure Logout**: Database token invalidation and cookie clearing.
- 🍪 **Flexible Token Delivery**: Supports HTTP-Only Cookies, raw headers (`x-access-token`, `token`), and Authorization headers (with or without `Bearer`).
- 🔒 **Password Security**: Strong password hashing and salting using `bcrypt` (10 salt rounds).
- 🏗️ **Clean MVC Architecture**: Layered separation across controllers, models, routes, middlewares, and utilities.
- 🚦 **Robust Error Handling**: Centralized error middleware with environment-aware stack traces and 404 handlers.
- 📦 **Mongoose Validations**: Schema-level validations and projection rules (`select: false`).

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Runtime & Framework** | Node.js (ES Modules), Express.js (v5) |
| **Database & ODM** | MongoDB Atlas, Mongoose (v9) |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcrypt`), Cookie-Parser |
| **Utilities & Dev Tools** | Dotenv, Nodemon |

---

## 📂 Architecture & Folder Structure

```text
authentication_system/
├── src/
│   ├── config/              # Centralized environment configuration & DB connection
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/         # Business logic layer
│   │   └── auth.controller.js # register, login, refreshAccessToken, logout, getProfile
│   ├── middlewares/         # Middleware layer
│   │   ├── auth.middleware.js # Direct token / Cookie auth verification
│   │   └── error.middleware.js# 404 & centralized error handlers
│   ├── models/              # Data schemas
│   │   └── user.model.js    # User schema with refreshToken & validations
│   ├── routes/              # Routing layer
│   │   ├── auth.routes.js   # Auth endpoints
│   │   └── index.js         # API v1 central router
│   ├── utils/               # Helpers
│   │   └── apiResponse.js   # Standardized API responses
│   ├── app.js               # Express application setup
│   └── server.js            # Server bootstrap
├── .env.example
├── .gitignore
├── index.js
└── package.json
```

---

## 📖 API Documentation

**Base URL**: `http://localhost:3000/api/v1`

### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "user": {
        "id": "673cf2b6040b080012345678",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
  }
  ```

---

### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "user": {
        "id": "673cf2b6040b080012345678",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
  }
  ```

---

### 3. Refresh Access Token
- **Method**: `POST`
- **Endpoint**: `/auth/refresh-token`
- **Headers / Body / Cookie**: Send via HTTP-Only cookie `refreshToken`, request body `{ "refreshToken": "..." }`, or header `x-refresh-token`.
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

---

### 4. Logout User
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Logged out successfully"
  }
  ```

---

### 5. Get User Profile *(Protected)*
- **Method**: `GET`
- **Endpoint**: `/auth/profile`
- **Headers** (No `Bearer` required! Send token directly):
  ```http
  Authorization: <YOUR_ACCESS_TOKEN>
  ```
  *OR*
  ```http
  x-access-token: <YOUR_ACCESS_TOKEN>
  ```
  *OR* via HTTP-Only cookie.

- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile fetched successfully",
    "data": {
      "user": {
        "_id": "673cf2b6040b080012345678",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      }
    }
  }
  ```

---

## ⚡ Getting Started

```bash
# Clone repository
git clone https://github.com/tarunrana1998/authentication_system.git
cd authentication_system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

---

## 🔐 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server Port | `3000` |
| `NODE_ENV` | Environment (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB Connection URL | — |
| `MONGO_DATABASE` | Database Name | `authentication_system` |
| `ACCESS_TOKEN_SECRET` | Secret key for access token | — |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh token | — |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime | `7d` |

---

## 👤 Author

**Tarun Rana**
- GitHub: [@tarunrana1998](https://github.com/tarunrana1998)
