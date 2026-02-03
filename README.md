# 🚀 Chat Application Frontend

A modern, responsive, and real-time chat interface built with **React 19**, **Tailwind CSS**, and **Socket.io**. This frontend provides a seamless messaging experience with features like real-time typing indicators, read receipts, and a premium UI/UX.

---

## 🛠 Tech Stack

- **Framework:** React 19
- **Styling:** Tailwind CSS (Modern, Responsive Design)
- **Icons:** React Icons
- **Real-time:** Socket.io-client
- **State Management:** React Context API
- **Routing:** React Router v7
- **Notifications:** React Hot Toast
- **API Handling:** Axios
- **Utilities:** Emoji Picker React

---

##  Key Features

###  Real-time Messaging
- Sub-100ms latency communication using **Socket.io**.
- **Typing Indicators:** See when your friends are typing.
- **Online Status:** Real-time tracking of active users.
- **Read Receipts:** Track message status (`sent` ➔ `delivered` ➔ `seen`).

###  Secure Authentication
- **Full Auth Flow:** Login, Signup, and Logout.
- **OTP Verification:** Secure account verification.
- **Password Recovery:** Forgot password and reset password functionality.
- **Protected Routes:** Unauthorized users are automatically redirected to login.

###  Premium UI/UX
- **Modern Design:** Sleek, glassmorphic elements and smooth transitions.
- **Emoji Support:** Integrated emoji picker for expressive messaging.
- **Image Sharing:** Send and view images within the chat.
- **Responsive Layout:** Optimized for both mobile and desktop screens.
- **Search:** Quickly find users and start new conversations.

###  Advanced Functionality
- **Infinite Scrolling:** Optimized message loading with cursor-based pagination (Backend integration).
- **Profile Management:** View and edit user profiles.
- **Message Deletion:** Support for "Delete for Me" and "Delete for Everyone".

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Running [Backend Service](https://github.com/aman70deep-singh/chatApp-Backend)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aman70deep-singh/chatApp-Frontend.git
   cd chatApp-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run start
   ```

---

##  Project Structure

```text
src/
├── api/            # API service configurations
├── components/     # Reusable UI components (Modals, Buttons, etc.)
├── context/        # Socket and Auth context providers
├── pages/          # Full-page components (Home, Login, Signup)
├── routes/         # Navigation and route protection
├── App.jsx         # Main application entry
└── index.jsx       # React DOM rendering
```




