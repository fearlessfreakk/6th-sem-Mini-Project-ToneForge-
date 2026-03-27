# ToneForge: Backend Architecture & Visuals

This document visualizes the core backend architecture and data flow of the ToneForge system, focusing on secure AI proxying and persistent storage.

## 1. System Architecture Overview

ToneForge follows a decoupled architecture where the Node.js backend acts as a secure intermediary between the user and AI services.

```mermaid
graph TD
    User((User/Client)) -->|JWT Request| API[Express API Layer]
    API -->|Auth Middleware| DB[(MongoDB)]
    API -->|Secure Proxy| AI[AI Service Layer]
    AI -->|Structured JSON| API
    API -->|Save Result| DB
    API -->|Response| User
```

---

## 2. API Data Flow

The following diagram illustrates the lifecycle of a request from the initial input to the final refined output.

```mermaid
sequenceDiagram
    participant C as Client (React)
    participant S as Server (Express)
    participant M as MongoDB
    participant AI as AI Service
    
    C->>S: POST /api/convert (Raw Text + Tone)
    S->>S: Validate JWT & Sanitize
    S->>AI: POST /formalize_email (Secure API Key)
    AI-->>S: Return Refined JSON
    S->>M: Store history (Original + Formalized)
    S-->>C: Return JSON (Refined Result)
```

---

## 3. Database Schema Visualization

The system uses a flexible MERN-stack schema to record all interactions and analytical data.

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +String password (hashed)
        +Date createdAt
    }
    class History {
        +ObjectId userId
        +String type (formalization/legal/negotiation)
        +String originalText
        +JSON serializedOutput
        +Date createdAt
    }
    User "1" --> "*" History : owns
```

---

## 4. Security & Integration Layer

- **JWT Middleware**: Every request is intercepted to verify the user's session authenticity.
- **Environment Isolation**: API keys and service URLs are managed via `.env` files, never exposed to the client.
- **Data Normalization**: The backend ensures that regardless of the AI model used, the frontend receives a consistent JSON structure.
