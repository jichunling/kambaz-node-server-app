import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";
import assignmentSchema from "../Assignments/schema.js";
import quizSchema from "../Quizzes/schema.js";
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
   quizzes: {
    type: [quizSchema], 
    default: [], },
 },
 { collection: "courses" });
export default courseSchema;
