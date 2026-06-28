# Employee Directory — Chapter 8 Individual Assignment

**Name:** KESAVA A/L VIKNESWARAN
**Matric Number:** A24CS0094  
**Course:** Cross Platform Application Development  
**Faculty:** Faculty of Computing, Universiti Teknologi Malaysia  

---

## Project Overview

A fully functional single-page Employee Directory web application that performs 
complete CRUD operations against a REST backend. Built with Vue 3 (Composition API), 
Axios, Node.js + Express, and MySQL.

---

## Tech Stack

- **Frontend:** Vue 3 with Composition API (`<script setup>`), built with Vite
- **HTTP Client:** Axios (single instance with interceptors)
- **Backend:** Node.js + Express (REST API)
- **Database:** MySQL via mysql2 (Promise-based pool, prepared statements)

---

## Setup Instructions

### Prerequisites
- Node.js installed
- Laragon running (MySQL on port 3306)

### Step 1 — Import the Database
Open Laragon and make sure MySQL is running, then run:
```bash
mysql -u root < "C:\Users\mithr\projects\employee-directory\sql\schema.sql"
```

### Step 2 — Install Dependencies
```bash
# Root (Vue + Vite)
npm install

# Backend (Express)
cd server
npm install
cd ..
```

### Step 3 — Start the App
Open two terminals:

**Terminal 1 — Express backend:**
```bash
node server/index.js
```

**Terminal 2 — Vue frontend:**
```bash
npm run dev
```

### Step 4 — Open in Browser
http://localhost:5174

---

## Project Structure
employee-directory/
├── src/
│   ├── components/
│   │   ├── EmployeeForm.vue    # Add/Edit form with validation
│   │   ├── EmployeeList.vue    # Employee table with actions
│   │   └── SearchSort.vue      # Search and sort controls
│   ├── services/
│   │   └── api.js              # Axios instance and API helpers
│   ├── App.vue                 # Parent component, state management
│   ├── main.js
│   └── style.css
├── server/
│   └── index.js                # Express REST API
├── sql/
│   └── schema.sql              # Database schema and seed data
├── index.html
├── package.json
├── vite.config.js
└── README.md