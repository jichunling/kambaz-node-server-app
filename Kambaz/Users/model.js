import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);
export default model;

//userModel allows us to talk to the database
//so we can find/insert/delete/update data and so on