import express from "express";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movies";
import { config, configDotenv } from "dotenv";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
config();

// Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
