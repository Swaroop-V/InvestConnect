
# Optimization Strategies & Test Plan
## Project: InvestConnect

This document details the optimizations applied to the codebase and architecture to ensure scalability, performance, and maintainability, along with the comprehensive test cases used to validate the system.

---

## 1. Optimization Strategies

### 1.1 Architecture Level Optimizations

| Strategy | Implementation Details | Benefit |
| :--- | :--- | :--- |
| **Serverless (BaaS)** | Leveraged **Google Firebase** for backend and database instead of a traditional Node.js/Express server. | Eliminates server maintenance overhead, provides auto-scaling, and reduces idle costs. |
| **CDN Asset Delivery** | Libraries (Tailwind, Firebase SDKs) are loaded via **global CDNs** (gstatic, cdnjs) rather than bundled locally. | Reduces initial server load and leverages browser caching of common libraries. |
| **Single Page Application (SPA)** | Implemented a hash-based router (`main.js`) that swaps views dynamically without reloading the page. | Provides a seamless, "App-like" experience with zero page transitions. |
| **NoSQL Data Structure** | Used **Firestore Documents** for flexible schema evolution. Data is denormalized where appropriate (e.g., storing author names in posts). | Reduces the need for complex joins and improves read performance. |

### 1.2 Code Level Optimizations

| Optimization | Description | File Location |
| :--- | :--- | :--- |
| **In-Memory Caching** | Implemented a caching layer (`_cache` object) with a 5-minute Time-To-Live (TTL). Repeated requests for Ideas/Proposals serve data from RAM instead of hitting the database. | `services.js` |
| **Event Delegation** | Instead of attaching listeners to every button (which impacts memory), a single listener is attached to the `document` to handle clicks and form submissions via event bubbling. | `main.js` |
| **Modular JavaScript** | Code is split into `main.js` (Controller), `services.js` (Model), and `views.js` (View) using ES6 Modules (`import`/`export`). | Enhances maintainability, readability, and allows for tree-shaking (if bundled later). |
| **Pure Functional Views** | View functions in `views.js` are stateless and return HTML strings. They do not manipulate the DOM directly. | Reduces side effects and makes UI rendering predictable and easy to test. |
| **Optimized Querying** | Filtered queries (e.g., `getIdeasByCategory`) reuse the In-Memory cache if the full list is already downloaded, avoiding an extra API call. | `services.js` |

---

## 2. Test Cases

The following test cases cover the critical paths of the application.

### 2.1 Authentication Module

| Test ID | Scenario | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | **User Signup** | 1. Navigate to `#/signup`<br>2. Fill Name, Email, Password.<br>3. Select Role "Entrepreneur".<br>4. Click "Sign Up". | User is redirected to Dashboard. Toast "Account Created" appears. User data stored in Firestore. | ✅ Pass |
| **TC-02** | **User Login** | 1. Navigate to `#/login`<br>2. Enter valid credentials.<br>3. Click "Sign In". | User is redirected to Dashboard based on Role. Toast "Welcome back" appears. | ✅ Pass |
| **TC-03** | **Logout** | 1. Click "Logout" icon in Navbar. | Session clears. User redirected to Home. Navbar changes to "Sign In" state. | ✅ Pass |

### 2.2 Role-Based Routing (RBAC)

| Test ID | Scenario | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-04** | **Entrepreneur View** | 1. Login as Entrepreneur.<br>2. Navigate to Dashboard. | User sees "Your Posted Ideas" and "Recent Proposals". | ✅ Pass |
| **TC-05** | **Investor View** | 1. Login as Investor.<br>2. Navigate to Dashboard. | User sees "Active Business Ideas" list and "Post Investment Intent" form. | ✅ Pass |
| **TC-06** | **Protected Route** | 1. Logout.<br>2. Manually type `#/dashboard` in URL bar. | Application detects no session and redirects immediately to `#/login`. | ✅ Pass |

### 2.3 Functional Operations (CRUD)

| Test ID | Scenario | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-07** | **Post Idea** | 1. As Entrepreneur, fill "Post New Idea" form.<br>2. Click Submit. | Form clears. New idea appears in the list immediately. Firestore document created. | ✅ Pass |
| **TC-08** | **Explore Page** | 1. Navigate to `#/explore`. | List of all ideas from all users is displayed. | ✅ Pass |
| **TC-09** | **View Details** | 1. Click "View Details" on an Idea card. | URL changes to `#/idea/:id`. Full description and funding amount displayed. | ✅ Pass |
| **TC-10** | **Filter Category** | 1. Click "Technology" on User Dashboard. | URL changes to `#/category/Technology`. Only tech-related ideas are shown. | ✅ Pass |

### 2.4 Performance & Error Handling

| Test ID | Scenario | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-11** | **Cache Hit** | 1. Load Dashboard (Network request fired).<br>2. Navigate away.<br>3. Navigate back to Dashboard within 5 mins. | Data loads instantly. Console logs "⚡ Serving from memory". No Network request. | ✅ Pass |
| **TC-12** | **Invalid API Key** | 1. Simulating missing API Key in config.<br>2. Attempt Login. | App catches error. Prompts user to enter valid API Key via `prompt()`. | ✅ Pass |
