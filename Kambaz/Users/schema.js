import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String,required: true },
    email: { type: String, unique: true },
    firstName: String,   
    lastName: String,
    dob: Date,
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
      default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
  },
  { collection: "users" }
);
export default userSchema;
