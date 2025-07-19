"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const db_config_1 = require("./config/db.config");
const env_config_1 = require("./config/env.config");
const error_handling_1 = require("./middlewares/error-handling");
const cors_config_1 = require("./config/cors.config");
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const adminRouter_1 = __importDefault(require("./routers/adminRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const secrete = env_config_1.env.SESSION_SECRET;
// MIddlewares
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: secrete,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)(cors_config_1.corsSetUp));
// Routers 
app.use('/auth', authRouter_1.default);
app.use('/users', userRouter_1.default);
app.use('/admin', adminRouter_1.default);
// Error Handler
app.use(error_handling_1.errorHandler);
const port = env_config_1.env.port;
(0, db_config_1.dbConnect)();
app.listen(port, () => {
    console.log('✅ Server  Running....');
});
