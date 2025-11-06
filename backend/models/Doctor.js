import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  consultancyFee: { // Renamed from 'price'
    type: Number,
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  rating: {
    type: Number,
    default: 0, // Default to 0, will be calculated
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;