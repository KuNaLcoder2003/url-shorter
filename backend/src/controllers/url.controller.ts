import express from "express"
import { generateShortUrl } from "../utility/url.js"
import { prisma } from "../db.js"
import { url_read_cache } from "../config/redis.js"
import { getAnalytics } from "../utility/analytics.js"
import { analytics_queue } from "../config/bullMq.js"
export const createShortUrl = async (req: any, res: express.Response) => {
    try {
        const email = req.email
        const user_id = req.id
        const { url } = req.body
        if (!url) {
            res.status(400).json({
                message: "Please provide url to shorten",
                valid: false
            })
            return
        }
        const nano_id_generated = generateShortUrl(url)
        const new_url = await prisma.$transaction(async (tx) => {
            const new_entry = await tx.nanoIds.create({
                data: {
                    nano_id: nano_id_generated,
                    user_id: user_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                    redirect_url: url
                }
            })
            return new_entry
        }, { maxWait: 5000, timeout: 10000 })
        if (!new_url) {
            res.status(403).json({
                message: "Unable to create short url",
                valid: false
            })
            return
        }
        res.status(201).json({
            message: "URL created successfully",
            valid: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
}

export const getUrl = async (req: express.Request, res: express.Response) => {
    try {
        // get the nanoId
        const nanoId = req.params.nanoId as string
        if (!nanoId) {
            res.status(400).send("Rquested page not available")
            return
        }


        const cache_hit = await url_read_cache.get(nanoId)
        // write analytics job to queue
        const analytics = getAnalytics(req.ip as string, req.headers['user-agent'] as string)
        const final_analytics = {
            ...analytics,
            ip_address: req.ip,

        }
        await analytics_queue.add("analytics_job", JSON.stringify({ nanoId: nanoId, analytics: final_analytics }))
        if (cache_hit) {
            const { redirect_url } = JSON.parse(cache_hit)
            res.redirect(redirect_url)
            return
        }

        // fetch from DB
        const response = await prisma.$transaction(async (tx) => {
            const url = await tx.nanoIds.findFirst({
                where: {
                    nano_id: nanoId
                },
                select: {
                    redirect_url: true
                }
            })
            return url
        }, { timeout: 10000, maxWait: 5000 })

        if (!response?.redirect_url) {
            res.status(404).send("Rquested page not available")
            return
        }
        // write to cache 
        await url_read_cache.set(nanoId, JSON.stringify({ redirect_url: response.redirect_url }), "EX", 43200)
        res.redirect(response.redirect_url)

    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong")
        return
    }
}