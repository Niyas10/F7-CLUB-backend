import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js'
import adminRoute  from './routes/adminRoute.js'
import dbConnect from './config/mongodb.js';


dotenv.config()
dbConnect() 

const app = express();
const PORT  = process.env.PORT || 8000


app.use(
    cors({
       origin:'http://localhost:5173',
       methods:['GET','POST','PUT','DELETE','PATCH'],
       credentials:true,
    })
)

app.use(express.urlencoded({extended:true, limit:"50mb"}))
app.use(express.json({limit:'50mb'}))


app.use('/',userRoute)
app.use('/admin',adminRoute)


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})