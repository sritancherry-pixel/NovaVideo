# NovaVideo V1 — Google Veo Video Generator

Mobile-first text-to-video app with a Node/Express backend connected to Google Veo 3.1.

## Requirements
- Node.js 18+
- Google Gemini API key with Veo access

## Setup
1. Extract the ZIP.
2. Open a terminal in `novavideo-ai`.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Put your key in `.env` as `GEMINI_API_KEY=...`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

The API key stays on the server and is never placed in the frontend.
