# 📄 EdiDox DOCX Editor App

A simple document editor built with **React** that allows users to upload `.docx` files, view and edit them in a rich text editor, and automatically save changes using **localStorage**.

This project demonstrates document parsing, rich text editing, routing, and state management using modern React practices.

🌐 Live Demo

👉 Deployed App:
https://edi-dox-kgw3.vercel.app/

---

## 🚀 Features

### 📤 Document Upload
- Upload **only `.docx` files**
- File type validation
- Extracts content from DOCX using **Mammoth**
- Displays uploaded file name
- Preserves basic spacing and headings

### ✍️ Rich Text Editor
- Displays extracted content in a rich text editor (React Quill)
- Supports:
  - Bold
  - Italic
  - Underline
  - Headings
  - Ordered & bullet lists
- Real-time content updates

### 💾 Save & Edit
- Edit document content
- **Auto-save** with debounce
- Stores documents in **localStorage**
- Displays last updated date & time
- Toggle between **edit** and **read-only** modes

### 📚 Document List (Sidebar)
- Lists all uploaded documents
- Shows document name and last updated time
- Search documents by name
- Delete documents

### 🧭 Routing
- `/` → Document list
- `/upload` → Upload document
- `/edit/:id` → Edit document
- `/view/:id` → View document (read-only)

---

## 🛠 Tech Stack

- **React** (Functional Components)
- **React Router DOM**
- **React Quill** (Rich Text Editor)
- **Mammoth** (DOCX → HTML)
- **LocalStorage** (Persistence)
- **CSS** (Component-based styling)

---

## 📂 Project Structure

src/

│
├── components/
│ ├── Editor/
│ ├── Header/
│ └── Sidebar/

│
├── pages/
│ ├── Upload/
│ └── Edit/

│
├── utils/
│ └── storage.js

│
├── App.jsx
├── main.jsx
└── index.css

## ▶️ Getting Started

```bash
npm install
npm run dev
