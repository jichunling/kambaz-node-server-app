import mongoose from "mongoose";
//many to many:
const enrollmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, unique: true },
    course: { type: String, ref: "CourseModel" },
    user: { type: String, ref: "UserModel" },
    grade: Number,
    letterGrade: String,
    enrollmentDate: Date,
    status: { type: String, enum: ["ENROLLED", "DROPPED", "COMPLETED"], default: "ENROLLED", },
    // Quiz attempts per student per course
    quizAttempts: [
      new mongoose.Schema(
        {
          quizId: { type: String, required: true },
          attemptNumber: { type: Number, required: true },
          answers: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
          score: { type: Number, default: 0 },
          totalPoints: { type: Number, default: 0 },
          takenAt: { type: Date },
          finalized: { type: Boolean, default: false },
        },
        { _id: false }
      ),
    ],
  },
  { collection: "enrollments" }
);
export default enrollmentSchema;
