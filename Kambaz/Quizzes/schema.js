import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    type: String,
    points: { type: Number, default: 0 },
    assignmentGroup: { type: String, default: "Quizzes" },
    description: String,
    published: { type: Boolean, default: false },
  
    // Quiz Settings
    shuffleAnswer: { type: String, default: "No" },
    timeLimit: { type: Number, default: 0 }, 
    multipleAttempts: { type: String, default: "No" },
    showCorrectAnswers: { type: String, default: "Never" },
    accessCode: { type: String, default: "No" },
    oneQuestionAtATime: { type: String, default: "Yes" },
    webcamRequired: { type: String, default: "No" },
    lockQuestionAfterAsnwering: { type: String, default: "No" }, 
  
    // Dates
    dueDate: { type: Date },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
  }
);
export default schema;