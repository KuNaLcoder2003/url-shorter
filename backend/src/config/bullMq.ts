import { Queue } from "bullmq"
export const analytics_queue = new Queue("analytics")

console.log(await analytics_queue.getCompleted())



