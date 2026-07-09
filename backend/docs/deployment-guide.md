# MedPath Learning Hub Backend - Deployment Guide

This document provides complete instructions for deploying the MedPath Learning Hub Backend service on local machines, staging environments, and production platforms.

---

## 1. Project Overview
* **Project Name**: MedPath Learning Hub Backend
* **Runtime**: Node.js (v18+)
* **Database**: MySQL relational database (with static memory-cached mock fallback)

---

## 2. GitHub Safety & Security Guidelines

> [!WARNING]
> To prevent leaking security credentials and local settings:
> - **Never commit the `.env` file** to git repository control. It is explicitly ignored via [.gitignore](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/.gitignore).
> - **Never hardcode real database passwords** or JWT keys in files under source control.
> - **Only configure sensitive keys** dynamically using Environment Variables.

---

## 3. Required Environment Variables

A template file is provided at [.env.example](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/.env.example). The following variables must be populated in the hosting provider's environment variables dashboard or inside a local `.env` configuration file:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Node process listener port | `5000` |
| `DB_HOST` | Database host address | `localhost` |
| `DB_USER` | Relational database username | `root` |
| `DB_PASSWORD` | Confidential DB password | `Srikrishna-963` |
| `DB_NAME` | Database schema name | `medpath_learning_hub` |
| `DB_PORT` | MySQL database connection port | `3306` |
| `ADMIN_API_KEY` | Admin authorization Direct API bypass key | `medpath-admin-123` |
| `ADMIN_USERNAME`| Admin console user login name | `admin` |
| `ADMIN_PASSWORD`| Admin console user login password | `MedPath@123` |
| `JWT_SECRET` | Secret token string for signing auth payloads | `medpath_jwt_secret_123` |
| `JWT_EXPIRES_IN`| Session token valid lifespan | `1d` |

---

## 4. Local & Server Deployment Steps

### Step A: Clone the Repository
Clone the repository containing the backend subfolder to your local machine or server.

### Step B: Environment Initialization
Copy the configuration template to create your active env file:
```bash
cp .env.example .env
```
Open `.env` and configure appropriate MySQL credentials and secret keys for JWT signing.

### Step C: Installation Command
Install the node dependencies listed in [package.json](file:///C:/Users/Elisetty%20Cheran%20Teja/Downloads/Medpath-Learning-Hub/backend/package.json):
```bash
npm install
```

### Step D: Database Setup
1. Log into your MySQL server instance:
   ```bash
   mysql -u root -p
   ```
2. Create the project database:
   ```sql
   CREATE DATABASE medpath_learning_hub;
   ```
3. Import the backup schema and initial seed configuration:
   ```bash
   mysql -u root -p medpath_learning_hub < database/medpath.sql
   ```
4. Alternatively, use the database seed script alias:
   ```bash
   npm run seed
   ```

### Step E: Startup Command
Run the server in production mode:
```bash
npm start
```
Or run the server in development mode (with nodemon reload):
```bash
npm run dev
```

---

## 5. Health Check & Core APIs

Once the backend service boots successfully, verify responsiveness by executing requests against the health-check endpoints:

- **Health Status API**: `GET /api/health`
  - Returns service status (`OK`) and confirms the API listener is live.
- **Self-Documenting Routes Table**: `GET /api/docs`
  - Dynamically lists all mounted HTTP endpoints, supported request variables, headers, and description guidelines.

---

## 6. Administrative Authentication Protocols

Protected administrative routes (starting with `/api/admin`) require authentication via one of two methods:
1. **JWT Session Token**:
   - Perform a request to `POST /api/auth/admin/login` passing `username` and `password` body attributes.
   - Attach the returned JWT inside the request headers: `Authorization: Bearer <your_jwt_token>`.
2. **Direct API Key Override**:
   - Send the system bypass header matching the configuration key: `x-admin-key: <ADMIN_API_KEY_value>`.
