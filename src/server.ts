import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("heloo world");
});

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});