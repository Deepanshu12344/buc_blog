import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 2,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allow null values
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;