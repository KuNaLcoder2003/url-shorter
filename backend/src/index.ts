import express from "express"
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import urlRouter from "./routes/url.route.js";
import { getUrl } from "./controllers/url.controller.js";
const app = express()

app.set("trus proxy", true)
app.use(cors())
app.use(express.json())


app.get('/:nanoId', getUrl)

app.use('/api/v1/url', urlRouter)
app.use('/api/v1/user', authRouter)
app.listen(3000, () => {
    console.log('App Started')
})


