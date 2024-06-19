import mongoose from 'mongoose';

const workoutSchema = mongoose.Schema({
  workoutName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  isListed: {
    type: Boolean,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);
