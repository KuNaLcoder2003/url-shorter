import express from "express"
import { createShortUrl } from "../controllers/url.controller.js";
import { rateLimitter } from "../middlewares/rateLimitter.js";
import { authMiddleWare } from "../middlewares/authMiddleware.js";

const urlRouter = express.Router()

urlRouter.post('/new-url', authMiddleWare, createShortUrl)

export default urlRouter;