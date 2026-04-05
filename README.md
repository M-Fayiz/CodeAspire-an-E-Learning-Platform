# CodeAspire

CodeAspire is a full-stack e-learning platform built to connect learners, mentors, and admins in one system. The project combines course publishing, enrollment, learner progress tracking, real-time chat, one-to-one video sessions, certificates, and an AI-powered learning assistant.

## What The Project Includes

- `FrontEnd/`: React + TypeScript + Vite client application
- `BackEnd/`: Node.js + Express + TypeScript API server
- Role-based flows for `admin`, `mentor`, and `learner`
- Real-time communication with Socket.IO
- One-to-one video session support
- Course enrollment, reviews, bookings, and certificates

## Core Features

- User authentication and role-based authorization
- Mentor onboarding and course publishing workflow
- Learner course browsing, enrollment, and progress updates
- Slot booking and video mentoring sessions
- Real-time chat and notifications
- Admin dashboards for users, categories, and courses
- Certificate generation for completed learning paths
- AI chatbot support for learner questions

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Zustand
- Backend: Node.js, Express, TypeScript, MongoDB, Redis, Socket.IO
- Integrations: Stripe, AWS S3, Google OAuth, Resend/Nodemailer, Gemini

## Project Structure

```text
CodeAspire/
|-- FrontEnd/
|-- BackEnd/
`-- README.md
```

## Getting Started

1. Clone the repository.
2. Install dependencies for both apps.
3. Create environment files for frontend and backend.
4. Start the backend server.
5. Start the frontend development server.

## Run Locally

Backend:

```bash
cd BackEnd
npm install
npm run dev
```

Frontend:

```bash
cd FrontEnd
npm install
npm run dev
```

## Documentation

- Frontend guide: [`FrontEnd/README.md`](./FrontEnd/README.md)
- Backend guide: [`BackEnd/README.md`](./BackEnd/README.md)

## Suggested Environment Setup

You will typically need values for:

- Frontend API base URL
- MongoDB connection string
- Redis connection details
- JWT secrets
- Google OAuth credentials
- Stripe keys and webhook secret
- AWS S3 credentials and bucket details
- Email provider credentials
- Gemini API key

## Status

This repository is structured as a production-style full-stack project with separate frontend and backend applications. The included README files are intended to help new contributors understand the system quickly and run both services locally.
