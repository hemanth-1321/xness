import express, { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userSchema } from "../types/zod";
import{prisma} from "@repo/primary-db/prisma"

const router: Router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Signup
router.post("/signup", async (req, res) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(403).json({ message: "Invalid input data" });
    }
  
    const existingUser = await prisma.user.findUnique({
      where:{
        email:parsed.data.email
      }
    })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists, please login" });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

   const newUser=prisma.user.create({
    data:{
      email:parsed.data.email,
      password:hashedPassword
    }
   })

    res.status(200).json({ userId:(await newUser).id });
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

    const user = await prisma.user.findUnique({
      where:{
        email:parsed.data.email
      }
    })
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.password);
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
