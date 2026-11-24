# university-bi-system
JIS College final year group project 2026-2027

# University Academic Data Warehouse & Business Intelligence (BI) System

A full-stack web application that centralizes fragmented university data (Student Information, Examinations, and Finance) into a unified MongoDB Data Warehouse and visualizes it through an interactive Business Intelligence dashboard with Role-Based Access Control (RBAC).

---

## Features

- **Centralized Data Warehouse:** Integrates student profiles, academic GPA records, and fee payment statuses into a single MongoDB repository (with automatic sample data seeding).
- **Interactive BI Dashboard:**
  - **Live KPI Cards:** Total Students, Average GPA, and Fee Collection Rate.
  - **Dynamic Charts (Chart.js):** Bar chart for GPA comparison and Doughnut chart for fee payment status.
  - **Department Slicing & Dicing:** Filter all KPIs, charts, and table records in real time by department.
- **Role-Based Access Control (RBAC) & JWT Auth:**
  - **Admin:** Full CRUD access (Add, Edit, Delete, View, Filter, Export).
  - **Faculty:** Read-only analytics access (View, Filter, Export).
- **CSV / Excel Export:** Download currently filtered warehouse records as a `.csv` report with one click.
- **Modern UI & Theme Sync:** Animated glassmorphism login page with a persistent **Dark / Light Mode** toggle synced across both the login portal and dashboard (including chart themes).

---

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, Bootstrap Icons, Chart.js, JavaScript (ES6+)
- **Backend:** Node.js, Express.js, JSON Web Token (`jsonwebtoken`), CORS
- **Database:** MongoDB with Mongoose ODM

---

## Project Structure

```text
university-bi-system/
├── server.js        # Express API, MongoDB connection, JWT auth & RBAC middleware
├── login.html       # Animated glassmorphism login portal with theme toggle
├── index.html       # Interactive BI dashboard, charts, CRUD modal & CSV export
├── package.json     # Project metadata and dependencies
└── .gitignore       # Excludes node_modules and .env files

Getting Started
Prerequisites
Node.js (v18+ recommended)

MongoDB (Local installation or MongoDB Atlas URI)

Installation
Clone the repository:

Bash
git clone [https://github.com/SUBHRAJIT2003/university-bi-system.git](https://github.com/SUBHRAJIT2003/university-bi-system.git)
cd university-bi-system
Install dependencies:

Bash
npm install
Configure MongoDB:

By default, server.js connects to mongodb://127.0.0.1:27017/university_dw.

If using MongoDB Atlas, update MONGO_URI in server.js with your connection string.

Start the backend server:

Bash
node server.js
The API will run at http://localhost:3000.

Open the application:

Open login.html in your web browser.
