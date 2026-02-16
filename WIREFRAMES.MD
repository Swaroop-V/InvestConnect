
# Wireframes & System Architecture Design
## Project: InvestConnect

This document outlines the System Architecture and the High-Level Wireframes for the InvestConnect platform.

---

## 1. System Architecture Design
*As requested, the System Architecture is included here in the Wireframe Document.*

### High-Level Data Flow
The InvestConnect system operates on a serverless architecture where the client browser interacts directly with cloud services.

```mermaid
flowchart TB
    subgraph Frontend_Client
        UI[User Interface (HTML/CSS)]
        Logic[Business Logic (JS)]
        Router[Client Router]
    end

    subgraph Backend_Services_Firebase
        Auth[Authentication Service]
        DB[(Firestore Database)]
        Hosting[Static Hosting]
    end

    User((User)) -->|HTTPS Request| Hosting
    Hosting -->|Returns Assets| UI
    
    UI -->|Input/Click| Logic
    Logic -->|Auth Request| Auth
    Logic -->|Data Query| DB
    
    DB -->|JSON Data| Logic
    Auth -->|Token/Session| Logic
    Logic -->|Update DOM| UI
```

### Core Modules
1.  **Authentication Module:** Handles Sign-up, Login, and Session Persistence.
2.  **Dashboard Controller:** Switches views based on User Role (Entrepreneur, Investor, etc.).
3.  **Marketplace Engine:** Fetches and displays Ideas, Proposals, and Loans.

---

## 2. Wireframes
The following schematics represent the layout structure for key pages in the application.

### 2.1 Landing Page (Home)
**Goal:** Convert visitors to users (Sign Up) and explain value proposition.

```text
+-------------------------------------------------------+
|  [Logo] InvestConnect            [Login] [Sign Up]    |  <-- Navbar
+-------------------------------------------------------+
|                                                       |
|   [ Hero Section ]                                    |
|   Bridge Between Investors & Business                 |
|   "Connect with the right people..."                  |
|                                                       |
|   [ CTA: Join Now ]   [ CTA: Explore Ideas ]          |
|                                                       |
+-------------------------------------------------------+
|   [ Feature Grid ]                                    |
|   +--------------+  +--------------+  +-----------+   |
|   | Entrepreneur |  |   Investor   |  |  Banker   |   |
|   |    [Icon]    |  |    [Icon]    |  |   [Icon]  |   |
|   +--------------+  +--------------+  +-----------+   |
+-------------------------------------------------------+
|                  [ Footer Links ]                     |
+-------------------------------------------------------+
```

### 2.2 Authentication (Login/Signup)
**Goal:** Secure user entry and Role Selection.

```text
+-------------------------------------------------------+
|  [Logo] InvestConnect                                 |
+-------------------------------------------------------+
|                                                       |
|        +-------------------------------------+        |
|        |  Sign Up                            |        |
|        |-------------------------------------|        |
|        |  Full Name: [____________________]  |        |
|        |  Email:     [____________________]  |        |
|        |  Role:      [ Dropdown v ]          |        | <-- Critical: Role Selection
|        |             - Entrepreneur          |        |
|        |             - Investor              |        |
|        |             - Banker                |        |
|        |  Password:  [____________________]  |        |
|        |                                     |        |
|        |  [ BUTTON: Create Account ]         |        |
|        +-------------------------------------+        |
|                                                       |
+-------------------------------------------------------+
```

### 2.3 Entrepreneur Dashboard
**Goal:** Allow Entrepreneurs to view market status and post ideas.

```text
+-------------------------------------------------------+
|  InvestConnect | Home | Explore | [Dashboard] | [User]|
+-------------------------------------------------------+
|                                                       |
|  Welcome, [Name]!                                     |
|                                                       |
|  +---------------------------+  +------------------+  |
|  |  Your Stats               |  |  Quick Actions   |  |
|  |  Ideas Posted: 3          |  |  [+] Post Idea   |  |
|  +---------------------------+  +------------------+  |
|                                                       |
|  [ Section: Your Posted Ideas ]                       |
|  +-------------------------------------------------+  |
|  | Idea Title: Tech Startup                        |  |
|  | Needed: $50,000 | Status: Active                |  |
|  +-------------------------------------------------+  |
|                                                       |
|  [ Section: Recent Investor Proposals ]               |
|  +-------------------------------------------------+  |
|  | Investor: John Doe                              |  |
|  | Looking to invest in Tech ($10k - $50k)         |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

### 2.4 Investor Dashboard
**Goal:** Allow Investors to browse ideas and post investment criteria.

```text
+-------------------------------------------------------+
|  InvestConnect | Home | Explore | [Dashboard] | [User]|
+-------------------------------------------------------+
|                                                       |
|  +----------------------+    +----------------------+ |
|  |  Browse Business     |    |  My Proposals        | |
|  |  (List of Ideas)     |    |  (Sidebar)           | |
|  |                      |    |                      | |
|  |  +----------------+  |    |  [+] Post Intent     | |
|  |  | Idea Card 1    |  |    |                      | |
|  |  | Category: Tech |  |    |  1. SaaS Funding     | |
|  |  | Ask: $100k     |  |    |     Range: 50k       | |
|  |  +----------------+  |    |                      | |
|  |                      |    |  2. Retail Angel     | |
|  |  +----------------+  |    |     Range: 10k       | |
|  |  | Idea Card 2    |  |    +----------------------+ |
|  |  +----------------+  |                             |
|  +----------------------+                             |
+-------------------------------------------------------+
```

### 2.5 Idea Details View
**Goal:** Detailed view of a specific pitch.

```text
+-------------------------------------------------------+
|  < Back to Explore                                    |
+-------------------------------------------------------+
|                                                       |
|  [ Category Badge ]   Date Posted                     |
|  <h1> IDEA TITLE </h1>                                |
|  by Author Name                                       |
|                                                       |
|  +-------------------------------+  +--------------+  |
|  |  Description                  |  | Funding Info |  |
|  |                               |  |              |  |
|  |  Detailed text block...       |  |  Target:     |  |
|  |                               |  |  $50,000     |  |
|  |  Why it matters...            |  |              |  |
|  |                               |  | [ Contact ]  |  |
|  +-------------------------------+  +--------------+  |
|                                                       |
+-------------------------------------------------------+
```
