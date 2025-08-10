
---

## 🔐 MERN-Auth – Secure Authentication System (Google OAuth & Apple)

A fully secure and scalable authentication system built using the **MERN Stack (MongoDB, Express, React, Node.js)**. This project implements best practices for modern authentication workflows, including:

### ✨ Features

- ✅ **Email/Password Authentication** (with strong validation)
- 🔐 **Secure Sessions and JWT Tokens**
- 🧠 **OAuth Integration**:
  - 🔵 **Login with Google** using OAuth 2.0
  - 🍎 **Login with Apple** using OAuth
- 🛡️ **Security Best Practices**:
  - Environment variables for all secrets
  - Bcrypt for password hashing
  - HTTP-only cookies and `withCredentials` setup
  - CSRF protection & CORS configuration
  - Input sanitization and validation
- 🌍 **Cross-platform Ready** – works across browsers and devices
- 📦 **Modular Codebase** – easy to scale and maintain
- 🧪 **Error Handling & Logging**

### 🛠️ Tech Stack

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **OAuth Providers**: Google, Apple
- **Security**: Bcrypt, JWT, Helmet, CORS, dotenv

### 🚀 Setup Instructions

1. Clone the repo  
   ```bash
   git clone https://github.com/your-username/Mern-AuthWithOauth.git
   cd mern-auth
   ```

2. Set up backend `.env` file  
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Apple OAuth
   APPLE_CLIENT_ID=your_apple_client_id
   APPLE_TEAM_ID=your_team_id
   APPLE_KEY_ID=your_key_id
   APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

   ```

3. Run backend
   ```bash
   cd server
   npm install
   nodemon index.js
   ```

4. Run frontend
   ```bash
   cd clint
   npm install
   npm run dev
   ```

---

### 📸 Screenshots
Signup
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f3744ce9-7f58-419a-a19a-b00a80cfe848" />
Login
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b0b831a1-c9a2-4b0e-aede-06843892d5cf" />
Home page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f715cf7f-1921-4e81-853f-82a00fa5f60d" />
---

### 🤝 Contributing

Feel free to open issues or submit pull requests if you'd like to improve the project!

---

### 📄 License

This project is licensed under the MIT License.

---
justinanurag0.2❤️
