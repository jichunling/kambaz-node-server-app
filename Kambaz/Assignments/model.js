import mongoose from "mongoose";
import schema from "./schema.js";
const assignmentModel = mongoose.model("assignmentModel",schema);
export default assignmentModel;