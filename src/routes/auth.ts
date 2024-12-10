import express, { Request, Response, Router } from "express";
import { readData, writeData } from "../helper/fileHelpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const USERS_FILE = "./src/storage/users.json";

// require('dotenv').config();
const JWT_SECRET =
  (process.env.JWT_SECRET as string) ||
  "70728c6235fe0363683b8e1093f39ee5dca1594712e3e5d3bf67f429539abfce";

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

// Register route
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const users: User[] = readData<User[]>(USERS_FILE);

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role: "user",
  };
  users.push(newUser);
  writeData(USERS_FILE, users);

  res.status(201).json({ message: "User registered successfully" });
});

// Login a user with password verification
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const users: User[] = readData<User[]>(USERS_FILE);

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // console.log("Generated Token:", token);

  res.status(200).json({ message: "Login successful", token });
});

export default router;
