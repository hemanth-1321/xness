import express, { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userSchema } from "../types/zod";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types/types";
import { getUserByEmail, addUser } from "../store/usermap";

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Signup
router.post("/signup", async (req, res) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(403).json({ message: "Invalid input data" });
    }

    const existingUser = getUserByEmail(parsed.data.email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login" });
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const newUser: User = {
      id,
      email: parsed.data.email,
      hashedPassword,
      balance: 5000
    };

    addUser(newUser);

    res.status(200).json({ userId: id });
  } catch (error) {
    console.log("error signing up", error);
    res.status(403).json({ message: "Error while signing up" });
  }
});

// Signin
router.post("/signin", async (req, res) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(403).json({ message: "Invalid input data" });
    }

    const user = getUserByEmail(parsed.data.email);
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
    if (!isValid) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("error signing in", error);
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

export default router;
