import Category from "../models/categoryModel.js";

export const loadCategories = async (req, res) => {
  try {
    const categorys = await Category.find();
    res.status(200).json({ categorys });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "internal server error" });
  }
};

export const addCatgories = async (req, res) => {
  try {
    const { name, isListed } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category alredy exists" });
    }
    const newCategory = new Category({
      name,
      isListed: isListed || true,
    });

    const savedCategory = await newCategory.save();
    res.status(200).json({ Category: savedCategory });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "Ineteral server error" });
  }
};

export const categoryBlock = async(req,res)=>{
    try{
        const {catId,status} = req.body
        const categories = await Category.findById(catId)
        if(!categories){
            return res.status(404).json({message:'catergory not found'})
        }
        const updatedStatus = !status

        const category = await Category.findByIdAndUpdate(
            catId,
            { $set: { isListed: !categories.isListed } },
            { new: true }
        );
        let message =""
        if(updatedStatus){
            message ="category is blocked"
        }else{
            message = 'category is unblocked'
        }
        res.status(200).json({message})
    } catch(error){
        console.log(error.message)
        res.status(500).json({status : "internal error"})
    }
}
