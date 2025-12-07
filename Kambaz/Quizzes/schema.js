import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  _id: String, // Use string IDs to align with UUIDs generated in DAO
  title: { type: String, default: "Question" },
  points: { type: Number, default: 0 },
  question: { type: String, default: "New Question" },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "fill-in-the-blanks"],
    default: "multiple-choice",
  },
  choices: [String], // For multiple-choice questions
  correctAnswer: mongoose.Schema.Types.Mixed, // For multiple-choice (string) and true/false (boolean)
  possibleAnswers: [String], // For fill-in-the-blanks questions
});
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
    questions: [questionSchema],
  }
);
export default schema;