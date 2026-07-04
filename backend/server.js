import express from "express";
import cors from "cors";
import contactRouter from "./contact.js";
import authRouter from "./auth.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

// Routes
app.use("/api", contactRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "KD College Backend running" });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
