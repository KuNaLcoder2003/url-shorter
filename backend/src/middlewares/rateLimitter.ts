
import express from "express"
import { rate_limiter_cache } from "../config/redis.js"

export const rateLimitter = async (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        const ip = req.ip as string
        const cache_hit = await rate_limiter_cache.get(ip)
        if (!cache_hit) {
            await rate_limiter_cache.set(ip, JSON.stringify({ count: 1, lastAccessed: (new Date()).toISOString() }), "EX", 300)
            next()
        } else {
            const { count, lastAccessed } = JSON.parse(cache_hit)
            const now = Date.now();
            const diff = now - lastAccessed;
            const minutes = diff / (1000 * 60);
            if (count > 10 && minutes < 1) {
                res.status(400).send("To many requests")
                return
            } else {
                await rate_limiter_cache.set(ip, JSON.stringify({ count: count + 1, lastAccessed: (new Date()).toISOString() }), "EX", 300)
                next()
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")

    }
}