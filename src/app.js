import express from "express";
import ApiRouters from './routers/ApiRouters.js'
import { IdNotFound, Empty, CodeRepeat } from "./err/err.js";

const app = express();

app.use('/api', ApiRouters)

app.use( (error, res) =>{
    switch(error.message) {
        case IdNotFound:
            res.status(404)
            break;
        case Empty:
            res.status(400)
            break;
        case CodeRepeat:
            res.status(400)
            break;
        default:
            res.status(500)
    }
    res.json({ message: error.message })
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Example app listening on port: ${PORT}`)
})