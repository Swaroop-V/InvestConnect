
# InvestConnect 🚀

> **Bridge Between Investors & Business**

InvestConnect is a web-based platform designed to connect **Entrepreneurs**, **Investors**, **Bankers**, and **Business Advisors**. It facilitates funding, investment opportunities, and professional guidance to fuel business growth.

![InvestConnect Banner](https://via.placeholder.com/1200x400?text=InvestConnect+Platform)

## 🌟 Features

*   **Role-Based Access:** Specialized dashboards for 5 different user types:
    *   **Entrepreneurs:** Post business ideas and seek funding.
    *   **Investors:** Browse opportunities and post investment proposals.
    *   **Bankers:** Post loan schemes and view business trends.
    *   **Advisors:** Share knowledge articles and answer business queries.
    *   **General Users:** Explore categories and view public listings.
*   **Live Database:** Real-time data storage using Google Firebase (Firestore).
*   **Authentication:** Secure Email/Password login and signup via Firebase Auth.
*   **Responsive Design:** Beautiful, mobile-friendly UI built with Tailwind CSS.
*   **Interactive UI:** Toast notifications, dynamic forms, and seamless navigation without page reloads (SPA).

## 🔄 Project Workflow (User Guide)

Here is how the application works for different users:

### 1. Registration & Authentication
*   Users click **Sign Up** and enter their details.
*   **Crucial Step:** The user selects a **Role** (Entrepreneur, Investor, Banker, Advisor, or General User).
*   Upon success, they are redirected to their specific **Dashboard**.

### 2. Entrepreneur Workflow
*   **Goal:** Get funding for a business idea.
*   **Action:** Navigate to Dashboard -> Fill out the "Post a New Idea" form (Title, Category, Amount Needed, Description).
*   **Result:** The idea is saved to the database and becomes visible to Investors and General Users on the "Explore" page.

### 3. Investor Workflow
*   **Goal:** Find businesses to invest in.
*   **Action:**
    1.  Browse the "Active Business Ideas" list on the Dashboard.
    2.  Click "View Details" to see the full pitch and funding requirements.
    3.  **Contact:** Use the "Contact Entrepreneur" button (simulation).
    4.  **Post Proposal:** Investors can also post "Investment Proposals" (e.g., "Looking to invest ₹50k in Tech") which Entrepreneurs can see.

### 4. Banker & Advisor Workflows
*   **Bankers:** Post new Loan Schemes (Interest rates, Tenure) visible to everyone.
*   **Advisors:** Post "Business Advice" articles and answer "Queries" sent by other users.

### 5. General/Guest Workflow
*   Guests can browse the **Home** page and **Explore** page to see public listings.
*   To view detailed contact info or post content, they must Sign Up/Login.

---

## ⚙️ Technical Execution Flow

This project is built as a **Single Page Application (SPA)** using Vanilla JavaScript and ES6 Modules.

1.  **Entry Point (`index.html`):**
    *   Loads the Tailwind CSS library.
    *   Sets up a root `div id="app"`.
    *   Imports `main.js` as a module.

2.  **Initialization (`main.js`):**
    *   **State Management:** Checks `localStorage` to see if a user is already logged in.
    *   **Router:** A custom hash-based router (`#/`, `#/dashboard`, `#/login`) detects URL changes.
    *   Based on the route, it calls specific functions from `views.js` to generate HTML string.
    *   It injects this HTML into the `#app` container.

3.  **Data Layer (`services.js`):**
    *   Initializes Firebase (Auth & Firestore).
    *   Exports methods like `login()`, `getIdeas()`, `postIdea()`.
    *   `main.js` calls these async methods to fetch data before rendering the views.

4.  **UI Rendering (`views.js`):**
    *   Contains pure functions that take data (e.g., an array of ideas) and return HTML Template Strings.
    *   Uses Tailwind utility classes for styling.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Edge).
*   (Optional but recommended) **Node.js** installed to run a local development server.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/InvestConnect.git
    cd InvestConnect
    ```

2.  **Run a Local Server:**
    Because this project uses JavaScript Modules (`import/export`), you cannot simply open `index.html` directly from your file explorer. You must serve it via a local HTTP server.

    **Option A: Using Python (Pre-installed on Mac/Linux)**
    ```bash
    # Run this inside the project folder
    python3 -m http.server
    # Open http://localhost:8000 in your browser
    ```

    **Option B: Using Node.js (npx)**
    ```bash
    npx serve .
    # Open the URL shown in the terminal (usually http://localhost:3000)
    ```

    **Option C: VS Code Live Server**
    If you use VS Code, install the "Live Server" extension, right-click `index.html`, and choose "Open with Live Server".

### Firebase Configuration

The project is currently configured with a placeholder configuration. To use your own backend:

1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  Create a new project.
3.  Enable **Authentication** (Email/Password provider).
4.  Enable **Firestore Database** (Start in Test Mode).
5.  Go to **Project Settings** -> **General** -> **Your apps** -> **SDK Setup and Configuration** (CDN).
6.  Open `services.js` and replace the `firebaseConfig` object with your own credentials.

## 📂 Project Structure

```
InvestConnect/
├── index.html       # Entry point
├── main.js          # Application logic & Routing
├── services.js      # Firebase configuration & API calls
├── views.js         # HTML Templates & UI Components
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
