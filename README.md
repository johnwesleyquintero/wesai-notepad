# 🧠 WesAI Notepad v0.1

A **local-first AI-enhanced notepad** built with **Vite + React (TypeScript)** for fast, offline-capable note creation and management.  
Designed with future **Gemini API integration** and AI text enhancement workflows in mind.

---

<img width="887" height="673" alt="image" src="https://github.com/user-attachments/assets/ef561839-0545-46e0-9bef-89870aca1fb5" />


## 🚀 Overview

**WesAI Notepad v0.1** enables users to create, edit, and manage notes seamlessly with auto-save and persistent localStorage storage.  
Built with modular, scalable architecture and optimized for rapid iteration, this app serves as the foundation for an AI-augmented writing environment.

---

## 🧩 Tech Stack

| Layer                        | Technology                              |
| ---------------------------- | --------------------------------------- |
| **Frontend**                 | React (TypeScript) + Vite + TailwindCSS |
| **State Management**         | useState / useReducer                   |
| **Storage**                  | localStorage                            |
| **AI Integration (Planned)** | Gemini API (Google AI Studio)           |

---

## ✨ Core Features

- 📝 **Create, Edit, Delete Notes** — persisted via localStorage
- 💾 **Auto-Save** — 3-second debounce with “Saved” indicator
- ⭐ **Favorites** — star notes for quick access
- 🧭 **Navigation Sidebar** — filter by Recent, Favorites, or All Notes
- ⚠️ **Delete Confirmation** — prevents accidental data loss
- 🤖 **AI Enhance Placeholder** — ready for Gemini API integration
- 🎨 **Minimalist UI** — inspired by Notion and Obsidian

---

## 🎨 Design Language

- **Theme:** Minimal, clean, distraction-free
- **Color Palette:**
  - Background: `#f5f5f4`
  - Text: `#18181b`
  - UI Elements: `#e2e8f0`

**Core Components**
| Component | Purpose |
|------------|----------|
| `NoteCard.tsx` | Displays title, preview, and timestamp |
| `NoteEditor.tsx` | Main editor area with auto-save logic |
| `Sidebar.tsx` | Navigation and “Add Note” button |
| `Toolbar.tsx` | Save indicator, AI actions, and settings button |

---

## 🧱 File Structure

```plaintext
src/
├── components/
│   ├── NoteCard.tsx
│   ├── NoteEditor.tsx
│   ├── Sidebar.tsx
│   └── Toolbar.tsx
├── hooks/
│   └── useLocalNotes.ts
├── pages/
│   └── Home.tsx
├── utils/
│   └── storage.ts
└── App.tsx
```

---

## ⚙️ Core Logic

### Custom Hook: `useLocalNotes`

Encapsulates all CRUD and persistence logic.

```typescript
methods = ["getNotes", "saveNote", "updateNote", "deleteNote"];
```

### Auto-Save System

- Saves after **3 seconds of inactivity**
- Displays “Saved” indicator once persisted
- Updates localStorage instantly for reliability

---

## 🔐 Gemini API Key Integration

**Settings Modal** (Phase 1 Complete)

- Securely stores Gemini API Key in localStorage
- Input field with show/hide toggle
- Direct link to [Google AI Studio](https://aistudio.google.com)
- Visual save confirmation feedback
- Fully modular for easy API call integration in Phase 2

---

## 🧠 Phase 2 — Enhancements

| Feature                  | Description                                  | Status       |
| ------------------------ | -------------------------------------------- | ------------ |
| 🔍 Search Functionality  | Search notes by title and content            | ✅ Completed |
| 🌙 Dark Mode             | Toggle between light and dark themes         | ✅ Completed |
| 🗂️ Categories/Tags       | Organize notes with custom categories        | ✅ Completed |
| 🤖 Gemini AI Integration | Text enhancement and tone rewriting          | 🔄 Planned   |
| 🕓 Version History       | Local revision logs per note                 | 🔄 Planned   |
| 📤 Export Options        | Markdown and JSON support                    | 🔄 Planned   |
| ☁️ Supabase Sync Layer   | Optional remote backup and multi-device sync | 🔄 Planned   |

---

## ⚡️ Quick Start

**1. Create project**

```bash
npm create vite@latest wesai-notepad --template react-ts
```

**2. Install dependencies**

```bash
npm install
```

**3. Run locally**

```bash
npm run dev
```

**4. Build for production**

```bash
npm run build
```

---

## ☁️ Deployment

**Goal:** Local-first → Continuous deployment via **Netlify**
**Pipeline Setup:**

- GitHub → Netlify auto-deploy
- LocalStorage persistence for now (Supabase optional Phase 2)

---

## 🧭 Developer Guidelines

- Keep logic **modular and documented**
- Maintain clear versioning for each feature addition
- Favor clarity and responsiveness over complexity
- Use this repo as the foundation for future WesAI applications

---

## 🧩 Version

**WesAI Notepad v0.1 (Prototype)**

> "Local-first. Modular by design. Ready for AI evolution."

---

## 👤 Author

**John Wesley Quintero**
_Amazon Specialist | Full-Stack Developer | Founder @ VAXPH_
Building sovereign digital systems with AI-assisted scalability.

---

## 📜 License

MIT License © 2025 John Wesley Quintero
