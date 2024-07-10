import Workout from ".././models/workoutModel.js";
import cloudinary from "../utils/cloudinary.js";

export const workoutList = async (req, res) => {
  try {
    const workouts = await Workout.find({ isListed: true }).populate(
      "category"
    );

    res.status(200).json({ workouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addWorkout = async (req, res) => {
  try {
    const { workoutName, description, difficulty, image, category } = req.body;
  
    const uploadPromises = image.map((images) => {
      return cloudinary.uploader.upload(images, { folder: "Workout" });
    });

    const uploadImages = await Promise.all(uploadPromises);
    const workOutImage = uploadImages.map((image) => image.secure_url);

    await Workout.create({
      workoutName,
      description,
      difficulty,
      category,
      images: workOutImage,
      isListed: true,
    });

    res.status(201).json({ message: "Workout added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editWorkoutDeatiles = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId);
    if (workoutId) {
      return res.status(200).json({ workout });
    }
    return res.status(404).json({ message: "Workout Not Found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error" });
  }
};




export const saveEditWorkout = async (req, res) => {
  const {
    workoutId,
    workoutName,
    description,
    difficulty,
    category,
    newImages,
    existingImages
  } = req.body;

  try {
    // Find the workout by ID
    let workout = await Workout.findById(workoutId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update workout fields
    workout.workoutName = workoutName;
    workout.description = description;
    workout.difficulty = difficulty;
    workout.category = category;

    // Handle image updates
    if (newImages && newImages.length > 0) {
      // Append new images to existing images array
      workout.images = [...existingImages, ...newImages];
    }

    // Save the updated workout
    workout = await workout.save();

    res.status(200).json({ message: 'Workout updated successfully', workout });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Error updating workout', error });
  }
};


export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    console.log(`Deleting workout with ID: ${workoutId}`);

    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (workout.images && workout.images.length > 0) {
      const deletePromises = workout.images.map((image) => {
        const publicId = image.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`Workout/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    await Workout.findByIdAndDelete(workoutId);
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};