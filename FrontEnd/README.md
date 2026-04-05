# CodeAspire Frontend

This frontend powers the CodeAspire user experience for learners, mentors, and admins. It is a React + TypeScript application built with Vite and includes routing, protected role-based pages, real-time features, dashboards, course flows, chat, notifications, and video-session screens.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- Socket.IO Client

## Main Frontend Features

- Public landing page and authentication flow
- Learner dashboard, enrolled courses, certificates, and bookings
- Mentor dashboard, course creation, slot management, and transactions
- Admin dashboards for users, categories, and course management
- Real-time chat and notification UI
- Video session pages for mentor and learner bookings

## Project Structure

```text
FrontEnd/
|-- public/
|-- src/
|   |-- components/
|   |-- context/
|   |-- features/
|   |-- hooks/
|   |-- pages/
|   |-- router/
|   |-- service/
|   |-- types/
|   `-- utility/
|-- package.json
`-- vite.config.ts
```

## Installation

```bash
cd FrontEnd
npm install
```

## Available Scripts

- `npm run dev`: Start the Vite development server
- `npm run build`: Type-check and create a production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier across the project

## Environment Variables

Create a `.env` file in `FrontEnd/` and add the values your app needs. A typical setup includes:

```env
VITE_API_BASE_URL=http://localhost:YOUR_BACKEND_PORT/api/v1
VITE_SOCKET_URL=http://localhost:YOUR_BACKEND_PORT
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Use the variable names that match your frontend config and service layer.

## Development Notes

- The app uses role-based routing for `learner`, `mentor`, and `admin`.
- Most API calls are organized in `src/service/`.
- Route definitions live in `src/router/AppRouter.tsx`.
- Shared API endpoint constants live in `src/constants/api.constant.ts`.

## Run The Frontend

```bash
npm run dev
```

After startup, open the local Vite URL shown in the terminal.
