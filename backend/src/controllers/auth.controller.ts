import express from "express"
import bcrypt from "bcrypt"
import { prisma } from "../db.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = `${process.env.JWT_SECRET}`
export const signupController = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const user_exists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user_exists) {
            res.status(402).json({
                message: "User already exists, please login",
                valid: false
            })
            return
        }
        const hashed_password = await bcrypt.hash(password, 10)
        const new_user = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashed_password,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            })
            return user
        }, { maxWait: 5000, timeout: 10000 })
        if (!new_user) {
            res.status(403).json({
                message: "Unable to create account",
                valid: false
            })
            return
        }
        const token = jwt.sign({ email: email, id: new_user.id }, JWT_SECRET)
        res.status(201).json({
            message: "Account created",
            valid: true,
            token: token,
            user: {
                name: new_user.name,
                email: new_user.email,
                created_at: new_user.created_at
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
}

export const signinController = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const user_exists = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user_exists) {
            res.status(402).json({
                message: "User doesnot exists , please signup",
                valid: false
            })
            return
        }
        const matched_pass = await bcrypt.compare(password, user_exists.password)
        if (!matched_pass) {
            res.status(401).json({
                message: "Wrong password , please enter correct password",
                valid: false
            })
            return
        }
        const token = jwt.sign({ email: email, id: user_exists.id }, JWT_SECRET)
        res.status(201).json({
            message: "Account created",
            valid: true,
            token: token,
            user: {
                name: user_exists.name,
                email: user_exists.email,
                created_at: user_exists.created_at
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
}