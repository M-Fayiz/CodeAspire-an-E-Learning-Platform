# CodeAspire Backend

This backend is the API and real-time service layer for CodeAspire. It handles authentication, course management, enrollments, bookings, payments, notifications, certificates, chat, chatbot support, and video-session coordination.

## Stack

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- Redis
- Socket.IO
- JWT Authentication
- Stripe
- AWS S3

## Main Backend Features

- Authentication and authorization for multiple user roles
- Course, category, enrollment, review, and order management
- Mentor slot creation and learner booking flows
- Real-time chat and notification support with Socket.IO
- Video-session startup endpoints
- Certificate generation and file handling
- AI chatbot integration for learner assistance

## Project Structure

```text
BackEnd/
|-- src/
|   |-- config/
|   |-- const/
|   |-- controllers/
|   |-- dtos/
|   |-- middlewares/
|   |-- models/
|   |-- repository/
|   |-- routers/
|   |-- services/
|   |-- socket.io/
|   |-- template/
|   |-- types/
|   `-- utils/
|-- dist/
|-- package.json
`-- tsconfig.json
```

## Installation

```bash
cd BackEnd
npm install
```

## Available Scripts

- `npm run dev`: Run the backend in watch mode using `tsx`
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Start the compiled server from `dist/app.js`
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Run ESLint with automatic fixes
- `npm run format`: Run Prettier across the project

## Environment Variables

Create a `.env` file in `BackEnd/`. Based on the current backend config, you will likely need values for:

```env
NODE_ENV=development
Port=5000
MONGO_URL=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:5173
CLIENT_URL_2=http://localhost:5173
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
SESSION_SECRET=your_session_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=your_google_callback_url
STRIPE_SECRET_KEY=your_stripe_secret_key
WEB_HOOK_SECRET_KEY=your_stripe_webhook_secret
AWS_S3_ACCESS_KEY=your_s3_access_key
AWS_S3_SECRET_KEY=your_s3_secret_key
AWS_S3_REGION=your_s3_region
AWS_S3_BUCKET_NAME=your_s3_bucket
REDIS_URL=your_redis_url
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
ENABLE_EMAIL_DELIVERY=true
```

You may also need additional values for logging, token expiry, revenue share, salts, email delivery, and Redis host/port settings depending on your deployment setup.

## API Overview

The server mounts routes under `/api/v1`. Current feature groups include:

- `/auth`
- `/users`
- `/admin`
- `/categories`
- `/courses`
- `/shared`
- `/orders`
- `/enrollements`
- `/reviews`
- `/notifications`
- `/chats`
- `/slots`
- `/slot-booking`
- `/video`
- `/certificate`
- `/chat-bot`
- `/webhook`
- `/health`

## Run The Backend

```bash
npm run dev
```

The app bootstraps the database connection, creates the HTTP server, and initializes Socket.IO before listening on the configured port.
