# Backend Setup Walkthrough

Welcome to the Medpath Learning Hub Backend API template. This document outlines the existing project structure and details the recommended next steps for development.

---

## 1. Verified Directory Structure

The backend directory has been scaffolded as follows:

```text
backend/
├── config/           # Configuration files (e.g. database connection db.js)
├── models/           # Data models (e.g., Mongoose schemas, Sequelize models)
├── routes/           # Express routes mapping HTTP endpoints to controllers
├── controllers/      # Route handlers/business logic for each endpoint
├── data/             # Seed data or data files
├── uploads/          # Directory to store uploaded media files
├── docs/             # Documentation files (e.g., API specifications, Swagger files)
├── server.js         # Core entry point of the backend application
└── walkthrough.md    # This setup guide
```

---

## 2. Immediate Next Steps for the Backend Developer

Follow these steps to complete the environment setup and begin adding API functionality:

### Step A: Initialize the Node.js Project
Navigate to the `backend` folder in your terminal and initialize a new Node project:
```bash
cd backend
npm init -y
```

### Step B: Install Core Dependencies
Install the required production and development dependencies.

**Production packages:**
* `express` - Minimalist web framework.
* `cors` - Middleware to enable Cross-Origin Resource Sharing.
* `dotenv` - To load configuration from a `.env` file.
* `mongoose` (or another ORM/ODM depending on your database choice).

```bash
npm install express cors dotenv mongoose
```

**Development packages:**
* `nodemon` - Automatically restarts the node application when file changes are detected.

```bash
npm install --save-dev nodemon
```

### Step C: Configure the `package.json` Scripts
Update your `package.json` in `backend/` to include start scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step D: Set Up Environment Variables
Create a `.env` file in the root of the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medpath_db
JWT_SECRET=your_jwt_secret_key_here
```

---

## 3. Best Practices & Architecture Patterns

* **Database Connection:** Place database connection logic inside `backend/config/db.js` (or similar) and import it in `server.js`.
* **Routing:** Keep routes clean by delegating the actual request processing logic to the controllers. 
  * *Example Route (`routes/auth.js`):* `router.post('/login', authController.login);`
* **Controllers:** Handle user input, call services/database queries, and return the HTTP response with appropriate status codes (e.g. `200 OK`, `201 Created`, `400 Bad Request`, `500 Server Error`).
* **Environment Variables:** Never hardcode configuration parameters or secrets. Always read from `process.env`.
