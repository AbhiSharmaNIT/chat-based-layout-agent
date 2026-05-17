# Chat-Based Layout Agent

A MERN-style chat-based layout editing application where users can modify a design layout using natural language commands.  
The app updates the layout JSON and shows a basic wireframe preview of the updated design.
<img width="1363" height="680" alt="image" src="https://github.com/user-attachments/assets/1c5b436b-ff49-486e-b8ba-b0dfabe31077" />

---

## Project Overview

This project allows a user to give layout instructions through a chat interface, such as:

- Move headline to top
- Make headline smaller
- Move offer badge higher
- Keep product large
- Convert this design to 9:16
- Change product image

Based on the instruction, the application updates the design JSON and displays the updated JSON in the UI.

---

## Features

- Chat-based layout editing interface
- Natural language commands for layout modification
- Updates layout JSON dynamically
- Supports follow-up instructions
- Displays updated JSON on the frontend
- Basic wireframe preview of the layout
- Product image preview support
- Maintains existing node IDs and image URLs
- Supports common layout transformations

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- OpenAI API / Rule-based fallback logic

---

## Folder Structure

```txt
Layout_Agent/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── WireframePreview.jsx
│   │   ├── data/
│   │   │   └── initialDesign.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   └── layoutController.js
│   ├── routes/
│   │   └── layoutRoutes.js
│   ├── services/
│   │   └── llmService.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
