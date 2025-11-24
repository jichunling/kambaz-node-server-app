import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("ModulesModel", schema);
export default model;
