const Category = require('../models/categoryModel')


export const loadCategories = async (req,res)=>{
    try{
        const categorys = await Category.find();
        res.status(200).json({categorys})
    }catch (error){
        console.log(error.message)
        res.status(500).json({status:"internal server error"})
    }
}