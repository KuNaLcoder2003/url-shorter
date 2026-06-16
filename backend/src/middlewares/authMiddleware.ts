import express from "express"
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
const JWT_SECRET = `${process.env.JWT_SECRET}`
export const authMiddleWare = (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const authToken = req.headers.authorization as string
        if (!authToken || !authToken.startsWith('Bearer ')) {
            res.status(401).json({
                message: "Unauthorized",
                valid: false
            })
            return
        }
        const token = authToken.split('Bearer ').at(-1) as string
        const verified = jwt.verify(token, JWT_SECRET) as { id: string, email: string }
        if (!verified) {
            res.status(401).json({
                message: "Unauthorized",
                valid: false
            })
            return
        } else {
            req.id = verified.id
            req.email = verified.email
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
        return
    }
}