import geoip from "geoip-lite"
import { UAParser } from "ua-parser-js"

export const getAnalytics = (ip: string, user_agent_header: string) => {
    const geoIp = geoip.lookup(ip)
    console.log('GEO IP LOOKUP IS : ', geoIp)
    const { browser, device, cpu } = UAParser(user_agent_header)
    return {
        country: geoIp?.country,
        region: geoIp?.region,
        device_model: device.model,
        device_vendor: device.vendor,
        browser_name: browser.name,
        browser_version: browser.version,
        browser_major: browser.major
    }
}