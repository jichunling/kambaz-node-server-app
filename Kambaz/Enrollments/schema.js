import mongoose from "mongoose";
//many to many:
const enrollmentSchema = new mongoose.Schema(
 { _id: {type: String,required: true, unique: true},
   course: { type: String, ref: "CourseModel" },
   user:   { type: String, ref: "UserModel"   },
   grade: Number,
   letterGrade: String,
   enrollmentDate: Date,
   status: {  type: String,enum: ["ENROLLED", "DROPPED", "COMPLETED"],default: "ENROLLED", }, },
 { collection: "enrollments" }
);
export default enrollmentSchema;
