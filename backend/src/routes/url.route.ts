import express from "express"
import { createShortUrl, getUrl } from "../controllers/url.controller.js";
import { rateLimitter } from "../middlewares/rateLimitter.js";

const urlRouter = express.Router()

urlRouter.post('/new-url', createShortUrl)
urlRouter.get('/:nanoId', rateLimitter, getUrl)

export default urlRouter;