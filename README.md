# 🏠 Plan Together - Backend

A real-time collaborative task management platform designed for couples, families, roommates, and small groups. Plan Together helps users organize shared responsibilities, manage daily tasks, and stay synchronized through instant real-time updates.

## ✨ Features

* 🔐 JWT Authentication & Authorization
* 📝 Create, Update, Delete, and Complete Tasks
* ⚡ Real-Time Task Synchronization with Socket.IO
* 👨‍👩‍👧 Shared Task Management
* 🔔 Live Updates and Notifications
* 📊 Task Status Tracking
* 🛡️ Request Validation with Zod
* 🗄️ MongoDB Database Integration
* 🏗️ Modular and Scalable Architecture

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Socket.IO
* JWT
* Zod

## 📁 Project Structure

```text
src/
├── config/
├── middlewares/
├── modules/
├── sockets/
│   ├── emitters/
│   ├── events/
│   ├── interfaces/
│   ├── listeners/
│   ├── middleware/
│   ├── socket.ts
│   └── types/
├── utils/
├── server.ts
└── index.ts
```

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/SakibFakir69/Plan-Together.git
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 🎯 Project Goal

Plan Together aims to simplify shared daily life management by providing a centralized platform where multiple users can collaborate on tasks, track progress, and receive real-time updates without communication gaps.



## 📄 License

This project is licensed under the MIT License.
