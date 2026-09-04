<div align="center">

# 🔐 Robust Authentication & Authorization API

An enterprise-grade, production-ready Authentication and Authorization RESTful API built with **Node.js**, **Express 5**, **MongoDB (Mongoose)**, **JWT (JSON Web Tokens)**, and **Bcrypt**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Secure_Tokens-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
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

- 🛡️ **Stateless Authentication**: Secure JWT (JSON Web Tokens) creation and verification flow.
- 🔒 **Password Security**: Strong password hashing and salting using `bcrypt` (10 salt rounds).
- 🏗️ **Clean MVC Architecture**: Modular separation of concerns across controllers, models, routes, middlewares, and services.
- 🚦 **Robust Error Handling**: Centralized global error handling with distinct development/production stack trace visibility and custom 404 handlers.
- 📦 **Mongoose Schema & Validation**: Schema-level validation, regex email verification, password length checks, and automatic exclusion of sensitive fields.
- ⚙️ **Config Management**: Centralized environment variable parsing with immutable configuration objects.
- 🚀 **ES Modules (`import`/`export`)**: Modern, standard JavaScript syntax throughout the codebase.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Runtime & Framework** | Node.js (ES Modules), Express.js (v5) |
| **Database & ODM** | MongoDB Atlas, Mongoose (v9) |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcrypt`) |
| **Utilities & Dev Tools** | Dotenv, Nodemon |

---

## 📂 Architecture & Folder Structure

The project adheres to a scalable, layered MVC architecture designed for maintainability and testability:

```text
authentication_system/
├── src/
│   ├── config/              # Configuration & database connections
│   │   ├── config.js        # Immutable environment variable loader
│   │   └── database.js      # Resilient MongoDB Atlas connection handler
│   ├── controllers/         # Business logic layer
│   │   └── auth.controller.js # Register, login, and profile handlers
│   ├── middlewares/         # Express middleware layer
│   │   ├── auth.middleware.js # JWT Bearer verification & user injection
│   │   └── error.middleware.js# 404 & centralized global error handling
│   ├── models/              # Mongoose data schemas
│   │   └── user.model.js    # User schema with validations & timestamps
│   ├── routes/              # Routing layer
│   │   ├── auth.routes.js   # Auth endpoints (/register, /login, /profile)
│   │   └── index.js         # Centralized API v1 router
│   ├── utils/               # Shared helpers & formatters
│   │   └── apiResponse.js   # Standardized JSON response utilities
│   ├── app.js               # Express application initialization & middleware
│   └── server.js            # Server entry point & DB bootstrap
├── .env.example             # Environment variable template
├── .gitignore               # Git exclusions
├── index.js                 # Root delegator
└── package.json             # Dependencies and scripts
```

---

## 📖 API Documentation

**Base URL**: `http://localhost:3000/api/v1`

### 1. Register User
Registers a new user, hashes password, and returns a signed JWT token.

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
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
Authenticates user credentials and returns a signed JWT token.

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### 3. Get User Profile *(Protected)*
Fetches the authenticated user's profile details. Requires a valid JWT token.

- **Method**: `GET`
- **Endpoint**: `/auth/profile`
- **Headers**:
  ```http
  Authorization: Bearer <YOUR_JWT_TOKEN>
  ```
- **Success Response (`200 OK`)**:
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
        "role": "user",
        "createdAt": "2026-09-04T12:00:00.000Z",
        "updatedAt": "2026-09-04T12:00:00.000Z"
      }
    }
  }
  ```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tarunrana1998/authentication_system.git
   cd authentication_system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration details in `.env` (see below).

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Start in production mode**:
   ```bash
   npm start
   ```

The server will boot up on `http://localhost:3000`.

---

## 🔐 Environment Variables

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Server listening port | `3000` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB connection connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `MONGO_DATABASE` | Target MongoDB database name | `authentication_system` |
| `JWT_SECRET` | Secret key used to sign and verify JWTs | `your_super_secret_jwt_key` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |

---

## 🛡️ Security Best Practices Implemented

- **Password Salting & Hashing**: Passwords are never stored in plain text.
- **Selective Projection (`select: false`)**: Sensitive fields such as passwords are excluded by default from Mongoose queries.
- **Environment Isolation**: Sensitive credentials, database URIs, and JWT keys are loaded exclusively from `.env` and kept out of version control.
- **Clean Error Messages**: Prevents leaking internal database error messages and stack traces to clients in production mode.

---

## 👤 Author

**Tarun Rana**
- GitHub: [@tarunrana1998](https://github.com/tarunrana1998)

---

## 📄 License

This project is licensed under the MIT License - feel free to use it for learning or commercial projects.
