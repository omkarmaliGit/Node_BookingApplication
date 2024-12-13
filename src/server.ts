import express from "express";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movies";
import theaterRoutes from "./routes/theaters";
import showRoutes from "./routes/shows";
import dotenv from "dotenv";
import authorize from "./middleware/authorize";

dotenv.config();
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// const excludedPaths = [
//   { path: "/auth/login", method: "POST" },
//   { path: "/auth/register", method: "POST" },
// ];

app.use(
  authorize([
    { path: "/auth/login", method: "POST" },
    { path: "/auth/register", method: "POST" },
  ])
);
// Routes
app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/theaters", theaterRoutes);
app.use("/shows", showRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
