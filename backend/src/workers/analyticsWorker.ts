import { Worker } from "bullmq"
import { writeAnalytics } from "../controllers/analytics.controller.js"
type Analytics = {
    country: string
    region: string
    device_model: string
    device_vendor: string
    browser_name: string
    browser_version: string
    browser_major: string
    ip_address: string
}

const work = new Worker('analytics', async (job) => {
    const { nanoId, analytics } = JSON.parse(job.data) as { nanoId: string, analytics: Analytics, }
    console.log(nanoId)
    // write analytics
    const done = await writeAnalytics(nanoId, analytics, job.id as string)
    return {
        success: done
    }
}, {
    connection: {
        host: '127.0.0.1',
        port: 6379,
    }
})