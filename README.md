# ⚒️ ToneForge - Precision Communication AI

> Transform your casual thoughts into professional masterpieces with just one click.

ToneForge is a powerful MERN stack application designed to bridge the gap between casual communication and professional excellence. Whether you're drafting a corporate email, an academic inquiry, or a business proposal, ToneForge uses advanced AI to refine your language, ensuring your message is delivered with the perfect tone and impact.

---

## ✨ Features

- **🚀 Intuitive AI Conversion**: Instantly transform casual text into formal, professional language.
- **🌍 Global Translation**: Professional-grade translation support for multiple languages (Spanish, French, German, etc.) integrated into the editor.
- **⚖️ Legal Analysis Engine**: Advanced parsing of contracts and legal emails to extract obligations, deadlines, and risk flags with a dashboard-style output.
- **🎭 Context-Aware Tones**: Choose between Business, Academic, or Corporate tones to suit your specific needs.
- **📂 Enhanced Audit Trail**: Secure history management for both email formalizations and legal reports, with support for translation viewing.
- **🔐 Secure Authentication**: Full user authentication system powered by JWT for safe and private use.
- **⚡ Premium UI/UX**: A state-of-the-art dashboard built with React, Framer Motion, and Lucide icons featuring mesh gradients and dynamic layouts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS with Modern UI patterns
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Networking**: Axios / Fetch

### Backend
- **Environment**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Security**: JWT & BcryptJS
- **API Communication**: Axios

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/fearlessfreakk/6th-sem-Mini-Project-ToneForge-.git
   cd 6th-sem-Mini-Project-ToneForge-
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   AI_BASE_URL=https://kush26-toneforge.hf.space
   AI_API_KEY=your_api_key
   ```

3. **Client Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd client && npm run dev`

---

## 🏗️ Project Structure

```text
├── client/          # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
├── server/          # Node.js + Express Backend
│   ├── models/      # Mongoose Schemas
│   ├── routes/      # API Routes
│   ├── controllers/ # Logic Handlers
│   └── middleware/  # Auth & Security
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

**ToneForge** - *Refining the way you communicate.* 🚀
