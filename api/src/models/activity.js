import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  },
  imgText: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: [
    {
      name: {
        type: String,
        required: true
      },
      age_range: {
        type: String,
        required: true
      },
      days: {
        type: String,
        required: true
      },
      schedule: {
        type: String,
        required: true
      },
    }
  ],
  data_target: {
    type: String,
    required: true
  }

});

export const activityModel = mongoose.model('activities', activitySchema);