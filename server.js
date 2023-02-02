import express from 'express';
import mongoose from 'mongoose';
import { PORT, DB_URL } from './config'
import router from './router';
import errorHandler from './middlewares/errorHandler';
import path from 'path';

const app = express()

global.appRoot = path.resolve(__dirname)


app.use(express.urlencoded({ extended: false }))
app.use(express.json())


mongoose.connect(DB_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', ()=>{
    console.log("DB Connected...")
})


app.use('/api', router)

app.use('/uploads',express.static('uploads')) // serve the static files (show uploaded images on server)


app.use(errorHandler)
app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNIG",PORT)
})