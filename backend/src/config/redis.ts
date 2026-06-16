import { Redis } from "ioredis"

export const url_read_cache = new Redis({
    host: "127.0.0.1",
    port: 6379,
})

export const rate_limiter_cache = new Redis({
    host: "127.0.0.1",
    port: 6380,
})