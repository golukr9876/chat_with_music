# 🎧 Realtime Chat + Music Sync Web App

A full‑stack **real‑time chat application** where users can **chat and listen to music together in sync**. Music actions like **play, pause, and seek** are synchronized for all users in a room using **WebSockets**.

Built with **React (Vite)** on the client and **Node.js + WebSocket** on the server.

---
** Deployed Link : ** 
```
https://chat-app-frontend-kgfp.vercel.app/
```

## ✨ Features

* 💬 Real‑time chat using WebSockets
* 🎶 Synchronized music playback (play / pause / seek)
* 👥 Multi‑user room support (single room by default)
* 🎵 Custom music player UI
* ⚡ Low‑latency communication
* 🧩 Modular React component structure

> ⚠️ **Note:** This project is currently **Work in Progress (WIP)**. Some core production features are still under development.

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS
* WebSocket client

### Backend

* Node.js
* WebSocket (ws)
* Express (lightweight setup)

---

## 📁 Project Structure

```
root
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   │   ├── Chat
│   │   │   │   └── ChatArea.jsx
│   │   │   ├── Music
│   │   │   │   └── SaavnMusicPlayer.jsx
│   │   │   └── MusicUI
│   │   │       ├── MiniMusicPlayer.jsx
│   │   │       ├── ScrollingTitle.jsx
│   │   │       └── is.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server
│   ├── app.js
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

---

## 🧠 Architecture Overview

### WebSocket Flow

1. Client connects to WebSocket server
2. Server assigns user to a room
3. Events are broadcast to all users in the room:

   * `chat_message`
   * `music_play`
   * `music_pause`
   * `music_seek`

### Sync Logic

* One user triggers an action (e.g., play)
* Event is sent to server
* Server broadcasts event to all connected clients
* Clients update music player state instantly

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 18
* npm

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/realtime-chat-music-app.git
cd realtime-chat-music-app
```

---

### 2️⃣ Setup Client

```bash
cd client
npm install
npm run dev
```

Client will run on:

```
http://localhost:5173
```

---

### 3️⃣ Setup Server

```bash
cd server
npm install
node app.js
```

Server runs on:

```
ws://localhost:8080
```

---

##
---

## 🎨 UI Components

* **ChatArea.jsx** – Handles chat UI & messages
* **SaavnMusicPlayer.jsx** – Main synced music player
* **MiniMusicPlayer.jsx** – Compact player UI
* **ScrollingTitle.jsx** – Song title marquee

---

## 🚧 Work In Progress (Planned Features)

The following features are **actively being worked on** and are not fully implemented yet:

* 🗄️ **Database integration** (MongoDB / PostgreSQL)

  * Store chat messages
  * Persist music room state

* 📬 **Offline message delivery**

  * If a user is offline, messages are currently **not delivered**
  * Planned: save messages server‑side and deliver when user reconnects

* 🔐 **Authentication & Authorization**

  * User login / signup
  * JWT‑based authentication
  * Secure WebSocket connections

* 🟢 **User presence tracking**

  * Online / offline status
  * Last seen timestamps

* 🏗️ **Server‑side refactor**

  * Better event validation
  * Scalable room management

---

## 🛠️ Future Improvements

* 🎧 Music queue & playlist
* 🏠 Multiple rooms with room codes
* ⏱️ Latency compensation
* 📱 Mobile responsiveness
* 🎼 Spotify / YouTube integration

---

## 🐛 Known Limitations

* No persistence (messages reset on refresh)
* Single room logic (can be extended)
* Depends on client clock sync

---


## ❤️ Author

Built with ❤️ by **Me**

If you like the project, drop a ⭐ on the repo!
