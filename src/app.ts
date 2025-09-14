import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {
    rateLimit,
    type RateLimitRequestHandler,
    ipKeyGenerator,
} from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
import logger from "./config/logger";
import { HttpError } from "http-errors";

const app: Express = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    }),
);
app.use(helmet());
app.use(cookieParser());

// Rate Limiter
const rateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request): string => {
        return typeof req.user?.id === "string"
            ? req.user.id
            : ipKeyGenerator(req.ip || "");
    },
});

app.use(rateLimiter);
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        console.log(
            `${req.method} ${req.originalUrl} - ${Date.now() - start}ms`,
        );
    });
    next();
});
// ROUTES
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err instanceof Error ? err.message : String(err));
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message =
        err instanceof Error ? err.message : "Internal Server Error";
    res.status(statusCode).json({
        errors: [{ type: "Error", msg: message, path: "", location: "" }],
    });
});

export default app;
