import express from 'express' 
import { adminLogin, userBlock, userList } from '../controllers/adminController.js'
import { addCatgories, categoryBlock, loadCategories } from '../controllers/categoryController.js';
import { addWorkout,saveEditWorkout, editWorkoutDeatiles, workoutList, deleteWorkout } from '../controllers/workoutController.js'; 
import { addBlog, blogList, deleteBlog, editBlogDeatiles, saveEditBlog } from '../controllers/blogController.js';
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
adminRoute.delete('/deleteWorkout/:workoutId',deleteWorkout)
adminRoute.put('/editedWorkout',saveEditWorkout)
adminRoute.get('/blogs',blogList)
adminRoute.post('/addBlog',addBlog)
adminRoute.get('/editBlog/:blogId',editBlogDeatiles)
adminRoute.put('/editedBlog',saveEditBlog)
adminRoute.delete('/deleteBlog/:blogId',deleteBlog)

export default adminRoute