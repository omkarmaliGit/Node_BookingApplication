import express from "express";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movies";
import theaterRoutes from "./routes/theaters";
import showRoutes from "./routes/shows";
import { config, configDotenv } from "dotenv";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

config();
configDotenv();

// Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/theaters", theaterRoutes);
app.use("/shows", showRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
