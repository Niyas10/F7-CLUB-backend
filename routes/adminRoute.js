import express from 'express' 
import { adminLogin, userBlock, userList } from '../controllers/adminController.js'
import { addCatgories, categoryBlock, loadCategories } from '../controllers/categoryController.js';
import { addWorkout, editWork, editWorkoutDeatiles, workoutList } from '../controllers/workoutController.js'; 
const adminRoute = express()



adminRoute.post("/login",adminLogin);
adminRoute.get("/userList",userList)
adminRoute.patch("/blockUser",userBlock)
adminRoute.get("/category",loadCategories)
adminRoute.post("/addCategory",addCatgories)
adminRoute.patch("/blockCategory",categoryBlock)
adminRoute.get("/workouts",workoutList)
adminRoute.post('/addworkout',addWorkout)
adminRoute.get('/editWorkout/:workoutId',editWorkoutDeatiles)
adminRoute.put('/editedWorkout',editWork)




export default adminRoute