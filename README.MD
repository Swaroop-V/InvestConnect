
# InvestConnect

**A Comprehensive Financial Networking Platform**

InvestConnect is a Single Page Application (SPA) designed to bridge the gap between Entrepreneurs, Investors, Bankers, and Business Advisors. This project was built to demonstrate proficiency in modern frontend development, component-based architecture, and cloud-based backend integration.

## 🛠 Technologies Used

*   **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
*   **Styling:** Tailwind CSS (Utility-first framework)
*   **Backend / Database:** Google Firebase (Firestore & Authentication)
*   **Architecture:** Component-based SPA without frameworks (Vanilla JS)
*   **Version Control:** Git & GitHub

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Custom dashboards for 5 distinct user roles (Entrepreneur, Investor, Banker, Advisor, General User).
*   **Real-time Data:** Live updates for business ideas, proposals, and queries using Firestore.
*   **Secure Authentication:** Integrated Firebase Auth for secure signup and login flows.
*   **Dynamic Routing:** Custom hash-based router implemented from scratch in Vanilla JS.
*   **Responsive UI:** Fully responsive design ensuring usability across mobile and desktop devices.
*   **Interactive Elements:** Dynamic toast notifications, modal-like forms, and live status indicators.

## 🔄 System Workflow

The application supports distinct workflows based on the user's selected role during registration:

1.  **Entrepreneurs:** Post detailed business pitches including funding requirements and category.
2.  **Investors:** Browse active pitches, view financial requirements, and post investment proposals.
3.  **Bankers:** List loan schemes with specific tenures and interest rates for businesses.
4.  **Advisors:** Publish expert articles and provide solutions to specific business queries posted by users.
5.  **General Users:** Explore market trends and business categories without posting rights.

## ⚙️ Technical Architecture

This application allows for a highly performant user experience by loading a single HTML entry point and dynamically swapping views based on the state.

1.  **Initialization (`main.js`):**
    *   Acts as the central controller.
    *   Initializes the Router and State Management (User Session).
    *   Handles global event listeners for navigation and form submissions.

2.  **Data Layer (`services.js`):**
    *   Abstracts all Firebase logic (Auth, Firestore) away from the UI.
    *   Provides asynchronous methods (`getIdeas`, `login`, `postQuery`) used by the controller.

3.  **Presentation Layer (`views.js`):**
    *   Contains pure functions that return HTML template strings.
    *   Uses Tailwind CSS classes for rapid, responsive styling.
    *   Ensures separation of concerns between logic and UI rendering.

## 💻 Local Development Setup

To run this project locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/InvestConnect.git
    cd InvestConnect
    ```

2.  **Serve the application:**
    Since this project uses ES6 Modules (`import`/`export`), it requires a local HTTP server to avoid Cross-Origin (CORS) errors.
    
    *   **Using Python:** `python3 -m http.server`
    *   **Using Node:** `npx serve .`
    *   **VS Code:** Use the "Live Server" extension.

3.  **Open in Browser:**
    Navigate to `http://localhost:8000` (or the port specified by your server).

## 📄 Project Status

This project was developed as an internship assignment to showcase full-stack development capabilities using serverless technologies. It serves as a functional MVP (Minimum Viable Product).

---
*Developed by [Your Name]*
