import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConnect } from "./config/db.config";
import { env } from "./config/env.config";
import { errorHandler } from "./middlewares/error-handling.middleware";
import { corsSetUp } from "./config/cors.config";
import authRouter from "./routers/auth.router";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import userRouter from "./routers/user.router";
import adminRouter from "./routers/adminRouter";
import categoryRouter from "./routers/category.router";
import courseRouter from "./routers/courses.router";
import sharedRouter from "./routers/shared.router";
import { orderRouter, webhookRouter } from "./routers/order.router";
import enrolledRouter from "./routers/enrolled.router";

dotenv.config();

const app = express();
const secrete = env.SESSION_SECRET as string;
// MIddlewares
app.use(cookieParser());
app.use(morgan("dev")); //morgan

/// exceptional case
app.use(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter,
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: secrete,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsSetUp));

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/shared", sharedRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/enrollements", enrolledRouter);
const port = env.port;
dbConnect();

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server  Running.... at${port} `);
});
