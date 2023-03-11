const express = require("express");
const morgan = require("morgan");
const rateLimit = require(`express-rate-limit`);
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require(`cookie-parser`);
const compression = require("compression");

const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRouters");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
// Global Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 120,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP , please try again in an hour!`,
});

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitazation agains NOSQL query injection
app.use(mongoSanitize());
// Data sanitazation  against XSS
app.use(xss());
// prevent prametr prolutin
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTame = new Date().toISOString();
  next();
});

// Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server !`, 404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
