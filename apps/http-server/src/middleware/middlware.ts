import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || "secret"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            error: "no token provided"
        })
    }


    const token = authHeader?.split("")[1]
    if (!token) {
        res.status(401).json({ error: "Invalid token format" });


        return
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
        (req as any).user = decoded

        next()


    } catch (error) {
        {
            res.status(401).json({ error: "Invalid or expired token" });

            return
        }
    }

}