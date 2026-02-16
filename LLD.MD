
# Low-Level Design (LLD) Document
## Project: InvestConnect

| Version | Date | Status | Author |
|:---:|:---:|:---:|:---:|
| 1.1 | Current | Final | [Your Name] |

---

## 1. Introduction
This document provides the low-level design specifications for **InvestConnect**, a financial networking platform. It details the system architecture, database schema, component interaction, and control flow logic required to implement the solution using **HTML, Tailwind CSS, Vanilla JavaScript (ES6), and Google Firebase**.

## 2. System Architecture
The application follows a **Client-Side MVC (Model-View-Controller)** pattern, adapted for a serverless environment.

### 2.1 Visual Architecture Diagram
```mermaid
graph TD
    User[End User] <-->|HTTPS / Browser| CDN[Hosting / CDN]
    CDN -->|Loads| SPA[Single Page App (HTML/JS)]
    
    subgraph Client_Side_Browser
        SPA -->|Router| Controller[main.js Controller]
        Controller -->|Render| View[views.js UI Layer]
        Controller -->|Calls| Service[services.js Data Layer]
    end
    
    subgraph Cloud_Backend_Firebase
        Service <-->|Auth SDK| Auth[Firebase Authentication]
        Service <-->|Firestore SDK| DB[(Cloud Firestore)]
    end

    User -->|Interacts| View
```

### 2.2 Architectural Components
*   **View (Presentation Layer):** `views.js`
    *   Responsible for generating HTML strings based on data.
    *   Stateless pure functions.
*   **Controller (Logic Layer):** `main.js`
    *   Manages Application State (User Session).
    *   Handles Routing (Hash-based navigation).
    *   Event Delegation (Form submissions, Clicks).
    *   Orchestrates data flow between Services and Views.
*   **Model/Service (Data Layer):** `services.js` & Firebase
    *   **BaaS (Backend as a Service):** Google Firebase.
    *   **Auth:** Firebase Authentication (Email/Password).
    *   **DB:** Cloud Firestore (NoSQL Document Store).
    *   **Facade Pattern:** `services.js` acts as an abstraction layer, hiding Firebase complexity from the Controller.

---

## 3. Database Design (Cloud Firestore)
The database utilizes a **NoSQL Document-Oriented** structure. Data is stored in collections of documents.

### 3.1 Schema Definitions

#### **Collection: `users`**
Stores user profile information and role definition.
```json
{
  "uid": "string (Primary Key - Matches Auth UID)",
  "name": "string",
  "email": "string",
  "role": "enum('ENTREPRENEUR', 'INVESTOR', 'BANKER', 'ADVISOR', 'USER')",
  "createdAt": "timestamp"
}
```

#### **Collection: `ideas`**
Business pitches posted by Entrepreneurs.
```json
{
  "id": "auto-generated-string",
  "authorId": "string (Foreign Key: users.uid)",
  "authorName": "string",
  "title": "string",
  "category": "string (e.g., Technology, Retail)",
  "amountNeeded": "number",
  "description": "string",
  "createdAt": "timestamp"
}
```

#### **Collection: `proposals`**
Investment intent posts made by Investors.
```json
{
  "id": "auto-generated-string",
  "authorId": "string",
  "authorName": "string",
  "title": "string",
  "investmentRange": "string",
  "description": "string",
  "createdAt": "timestamp"
}
```

#### **Collection: `loans`**
Loan schemes posted by Bankers.
```json
{
  "id": "auto-generated-string",
  "bankerId": "string",
  "bankName": "string",
  "title": "string",
  "interestRate": "number",
  "tenureMonths": "number",
  "maxAmount": "number",
  "description": "string",
  "createdAt": "timestamp"
}
```

#### **Collection: `queries`**
Business questions posted by any user.
```json
{
  "id": "auto-generated-string",
  "authorId": "string",
  "title": "string",
  "content": "string",
  "solutions": [
    {
      "authorId": "string (Advisor ID)",
      "authorName": "string",
      "content": "string",
      "createdAt": "timestamp"
    }
  ],
  "createdAt": "timestamp"
}
```

---

## 4. Component Design & Module Interaction

### 4.1 `services.js` (The Service Layer)
*   **Pattern:** Module/Singleton.
*   **Responsibility:**
    *   Initializes Firebase App instance.
    *   Exports a `services` object containing async methods.
    *   Handles `try/catch` logic for network requests.
*   **Key Methods:**
    *   `login(email, password)`: Returns User Object with Role.
    *   `signup(userData)`: Creates Auth user + Firestore User Document.
    *   `getIdeas()`: Fetches collection, mapped to array.
    *   `postIdea(data)`: Writes to Firestore.

### 4.2 `views.js` (The View Layer)
*   **Pattern:** Functional UI (Input Data -> Output HTML String).
*   **Responsibility:**
    *   Contains template literals for all UI pages.
    *   Uses Tailwind CSS classes for styling.
    *   **No logic** regarding data fetching or event handling allowed here.
*   **Key Functions:**
    *   `navbar(user)`: Returns dynamic nav based on login state.
    *   `dashboard[Role](data)`: Returns specific dashboard HTML based on user role.

### 4.3 `main.js` (The Controller)
*   **Pattern:** Event-Driven State Machine.
*   **Responsibility:**
    *   **State:** Maintains `state.user` object.
    *   **Router:** Listens to `window.hashchange`. Matches `#hash` to specific Service calls + View rendering.
    *   **Event Listeners:** Uses **Event Delegation** on the `document` to handle clicks (Login, Logout) and Form Submissions (Post Idea, Post Query) to avoid attaching listeners to dynamic elements repeatedly.

---

## 5. Application Logic & Algorithms

### 5.1 Routing Algorithm (Client-Side)
1.  **Event:** `window.addEventListener('hashchange', router)` fires.
2.  **Route Parsing:** Reads `window.location.hash`.
    *   If empty, default to `#/`.
3.  **Authentication Check:**
    *   If route is `#/dashboard` AND `state.user` is null -> Redirect to `#/login`.
4.  **Data Fetching:**
    *   If route requires data (e.g., Explore), `await services.getIdeas()`.
    *   Show "Loading..." spinner while fetching.
5.  **View Rendering:**
    *   Call `views.pageName(data)`.
    *   Inject result into `<div id="app">`.

### 5.2 Role-Based Access Control (RBAC) Strategy
The system handles 5 distinct roles. This is managed in the **Controller (`main.js`)**:

```javascript
// Pseudo-code for Dashboard Routing
switch (user.role) {
    case 'ENTREPRENEUR':
        data = await services.getIdeas();
        render(views.dashboardEntrepreneur(data));
        break;
    case 'INVESTOR':
        ideas = await services.getIdeas();
        proposals = await services.getProposals();
        render(views.dashboardInvestor(ideas, proposals));
        break;
    // ... cases for BANKER, ADVISOR, USER
}
```

### 5.3 Authentication Flow
1.  **Sign Up:**
    *   Create Auth User (Firebase Auth).
    *   **Atomic Operation:** Immediately create a User Document in Firestore with the selected `role`.
2.  **Login:**
    *   Authenticate via Firebase Auth.
    *   Retrieve UID.
    *   Fetch User Document from Firestore using UID to get the `role` and `name`.
    *   Store in `localStorage` for persistence across refreshes.

---

## 6. Deployment & Environment Strategy

*   **Hosting:** Static hosting (Firebase Hosting / Vercel).
*   **Environment Variables:** API Keys are embedded in `services.js` (Client-side config) but secured via Firebase Console "Authorized Domains" settings to prevent unauthorized usage from other domains.
*   **Dependencies:** No Node.js runtime required for production. Uses ES Modules via CDN (`gstatic.com`, `tailwindcss.com`).

## 7. Security Considerations
1.  **XSS Protection:** While using `innerHTML`, input sanitization is delegated to the browser's handling of standard text inputs.
2.  **Access Rules:** Firestore Security Rules (Server-side) must be configured to ensure:
    *   Only authenticated users can write to `ideas`, `proposals`, etc.
    *   Public read access is allowed for `ideas` (for the Explore page).
