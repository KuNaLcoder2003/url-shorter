import { prisma } from "../db.js"

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
export const writeAnalytics = async (nanaoId: string, analytics: Analytics, job_id: string) => {
    try {
        const new_analytics = await prisma.$transaction(async (tx) => {
            const new_entry = await tx.analytics.create({
                data: {
                    nano: {
                        connect: {
                            nano_id: nanaoId
                        }
                    },
                    ...analytics,
                    time_stamps: Date.now().toString()
                }
            })
            return new_entry
        }, { maxWait: 4000, timeout: 8000 })
        if (!new_analytics) {
            return false
        }
        else {
            return false
        }
    } catch (error) {
        console.log('JOB ID : ', job_id)
        console.log('Error is : ', error)
        return false

    }
}