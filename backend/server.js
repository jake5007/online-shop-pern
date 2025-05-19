import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import {
  productRoutes,
  categoryRoutes,
  authRoutes,
  cartRoutes,
  orderRoutes,
} from "./routes/index.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import {
  createCategories,
  createProducts,
  createUsers,
  createCarts,
  createOrders,
} from "./schema/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();
const csrfProtection = csrf({
  cookie: true,
});

const allowedOrigins = {
  development: ["http://localhost:5173"],
  production: ["https://online-shop-pern.onrender.com/"],
};

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins[process.env.NODE_ENV],
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(csrfProtection);

// arcjet for all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too many requests. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({
          error: "Bots are not allowed.",
        });
      } else {
        res.status(403).json({
          error: "Access denied.",
        });
      }

      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({
        error: "Spoofed bots are not allowed.",
      });

      return;
    }

    next();
  } catch (error) {
    console.log("Error in Arcjet: ", error);
    next(error);
  }
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

async function initDB() {
  try {
    await createCategories(sql);
    await createProducts(sql);
    await createUsers(sql);
    await createCarts(sql);
    await createOrders(sql);

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }
}

if (process.env.NODE_ENV === "development") {
  initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
