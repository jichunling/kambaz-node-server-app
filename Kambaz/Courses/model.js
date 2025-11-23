import mongoose from "mongoose";
import schema from "./schema.js";
const courseModel = mongoose.model("CourseModel",schema);
export default courseModel;
