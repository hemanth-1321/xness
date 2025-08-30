import express, { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { userSchema } from "../types/user"
const router: Router = express.Router()
import { v4 as uuidv4 } from "uuid"

interface User {
    id: string,
    email: string,
    hashedPassword: string,
    balance:number
}   
const JWT_SECRET = process.env.JWT_SECRET || "secret"

const users = new Map<string, User>()


router.post("/signup", async (req, res) => {
    try {
        const parsed = userSchema.safeParse(req.body)
        console.log("recied data", parsed.data)

        if (!parsed.success) {
            res.status(403).json({
                message: "Invalid input data"
            })
            return
        }
        if (users.has(parsed.data.email)) {
            res.status(400).json({
                message: "User already exists please login"
            })
            return
        }

        const id = uuidv4()
        const email = parsed.data.email
        const hashedPassword = await bcrypt.hash(parsed.data.password, 10)

        users.set(email, {
            id, email, hashedPassword,balance:5000
        })
        res.status(200).json({
            userId: id
        })


    } catch (error) {
        console.log("error signing up", error)
        res.status(403).json({
            message: "Error while signing up"
        })
    }
})



router.post("/signin", async (req, res) => {
    try {
        const parsed = userSchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(403).json({
                message: "Invalid input data"
            })
            return
        }
        const user = users.get(parsed.data.email)
        if (!user) {
            res.status(403).json({
                message: "invalid credentialds"
            })
            return
        }

        const isvalid = await bcrypt.compare(parsed.data.password, user?.hashedPassword)

        if (!isvalid) {
            res.status(403).json({
                message: "invalid credentialds"
            })
            return
        }

        const token = jwt.sign({ email: user?.email }, JWT_SECRET, {
            expiresIn: "7d"
        })
        res.status(200).json({
            token
        })
    } catch (error) {
        console.error("error signing in ", error)
        res.status(403).json({
            message: "Incorrect credentials"
        }
        )
    }
})

export default router
