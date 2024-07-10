import Blog from ".././models/blogModel.js";
import cloudinary from "../utils/cloudinary.js";

export const blogList = async (req, res) => {
  try {
    const blogs = await Blog.find({ isListed: true });
    res.status(200).json({ blogs });
  } catch (error) {
    console.log("Error fetching workouts", error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const addBlog = async (req, res) => {
  try {
    const { blogName, description, images } = req.body;

    const uploadPromises = images.map((image) => {
      return cloudinary.uploader.upload(image, { folder: "Blogs" });
    });
    const uploadedImages = await Promise.all(uploadPromises);
    const blogImages = uploadedImages.map((image) => image.secure_url);

    await Blog.create({
      blogName,
      description,
      images: blogImages,
      isListed: true,
    });
    res.status(201).json({ message: "Blog added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editBlogDeatiles = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (blogId) {
      return res.status(200).json({ blog });
    }
    res.status(404).json({ message: "Workout not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const saveEditBlog = async (req, res) => {
  const { blogId, blogName, description, newImages, existingimages } = req.body;
  try {
    let blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.blogName = blogName;
    blog.description = description;
    if (newImages && newImages.length > 0) {
      blog.images = [...existingimages, ...newImages];
    }
    blog = await blog.save();

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error("Error updating blog", error);
    res.status(500).json({ message: "Error updating blog" });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    if (blog.images && blog.images.length > 0) {
      const deletePromises = blog.images.map((image) => {
        const publicId = image.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`Blogs/${publicId}`);
      });
      await Promise.all(deletePromises);
    }
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};