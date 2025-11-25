import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";
import assignmentSchema from "../Assignments/schema.js";
const courseSchema = new mongoose.Schema({
   _id: String,
   name: String,
   number: String,
   credits: Number,
   description: String,
   modules: [moduleSchema],
   assignments: {
    type: [assignmentSchema], 
    default: [], },
 },
 { collection: "courses" });
export default courseSchema;
