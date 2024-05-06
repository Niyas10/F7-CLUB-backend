import express from 'express' 
import { adminLogin, userBlock, userList } from '../controllers/adminController.js'
const adminRoute = express()



adminRoute.post("/login",adminLogin);
adminRoute.get("/userList",userList)
adminRoute.patch("/blockUser",userBlock)




export default adminRoute