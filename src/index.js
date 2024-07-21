import { app } from "./app.js"
import connectDb from "./db/index.js"
import dotenv from 'dotenv'
dotenv.config({
    path: "./.env"
})
const PORT = process.env.PORT
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on the Port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Connection Error", error)
    })