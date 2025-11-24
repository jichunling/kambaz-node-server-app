import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },         
    name: { type: String, required: true },
    points:  {type: Number} ,
    description: {type: String },
    dueDate: { type: Date },
    AvailableFrom: { type: Date },
    AvailableUntil: { type: Date }
 },
 { collection: "assignments" });
export default assignmentSchema;