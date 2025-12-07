import {
  createQuiz as daoCreateQuiz, findQuizzesForCourse as daoFindQuizzesForCourse,
  deleteQuiz as daoDeleteQuiz, updateQuiz as daoUpdateQuiz,
  updateQuizPublishStatus as daoUpdateQuizPublishStatus, createQuestion as daoCreateQuestion,
  deleteQuestion as daoDeleteQuestion
} from "../Quizzes/dao.js";


export default function QuizzesRoutes(app) {

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await daoFindQuizzesForCourse(courseId);
    res.json(quizzes);
  }

  // Create a new question in a quiz (supports multiple types)
  const createQuestion = async (req, res) => {
    try {
      const { courseId, quizId, qid } = req.params;
      // Support either :quizId or :qid param
      const resolvedQuizId = quizId || qid;
      const payload = req.body || {};

      // Basic required fields
      const { title, points, question, type } = payload;

      // Validate title
      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }

      // Validate points
      if (points === undefined || points === null || Number.isNaN(Number(points))) {
        return res.status(400).json({ error: "Points must be a number" });
      }

      // Validate question prompt
      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question text is required" });
      }

      let newQuestion;
      if (type === "multiple-choice") {
        const { choices, correctAnswer } = payload;
        if (!Array.isArray(choices) || choices.length < 2) {
          return res.status(400).json({
            error: "Choices must be an array with at least two options",
          });
        }
        const normalizedChoices = choices
          .map((c) => (typeof c === "string" ? c.trim() : c))
          .filter((c) => typeof c === "string" && c.length > 0);
        if (normalizedChoices.length !== choices.length) {
          return res.status(400).json({ error: "All choices must be non-empty strings" });
        }
        if (typeof correctAnswer !== "string") {
          return res.status(400).json({ error: "correctAnswer must be a string matching one of the choices" });
        }
        const normalizedCorrect = correctAnswer.trim();
        if (!normalizedChoices.includes(normalizedCorrect)) {
          return res.status(400).json({ error: "correctAnswer must be one of the provided choices" });
        }
        newQuestion = {
          title,
          points: Number(points),
          question,
          type: "multiple-choice",
          choices: normalizedChoices,
          correctAnswer: normalizedCorrect,
        };
      } else if (type === "true-false") {
        const { correctAnswer } = payload;
        if (typeof correctAnswer !== "boolean") {
          return res.status(400).json({ error: "correctAnswer must be boolean for true-false" });
        }
        newQuestion = {
          title,
          points: Number(points),
          question,
          type: "true-false",
          correctAnswer,
        };
      } else if (type === "fill-in-the-blank" || type === "fill-in-the-blanks") {
        // Accept either naming, store as fill-in-the-blanks per schema
        const { possibleAnswers } = payload;
        if (!Array.isArray(possibleAnswers) || possibleAnswers.length < 1) {
          return res.status(400).json({ error: "possibleAnswers must be a non-empty array of strings" });
        }
        const normalized = possibleAnswers
          .map((a) => (typeof a === "string" ? a.trim() : a))
          .filter((a) => typeof a === "string" && a.length > 0);
        if (normalized.length !== possibleAnswers.length) {
          return res.status(400).json({ error: "All possibleAnswers must be non-empty strings" });
        }
        newQuestion = {
          title,
          points: Number(points),
          question,
          type: "fill-in-the-blanks",
          possibleAnswers: normalized,
        };
      } else {
        return res.status(400).json({
          error: "Unsupported question type",
          supported: ["multiple-choice", "true-false", "fill-in-the-blanks"],
        });
      }

      const created = await daoCreateQuestion(courseId, resolvedQuizId, newQuestion);
      return res.status(201).json(created);
    } catch (err) {
      console.error("❌ Error creating question:", err);
      // Provide clearer error if course or quiz not found
      if (err && typeof err.message === "string" && err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }
      return res.status(500).json({ error: "Failed to create question" });
    }
  };

  // Delete a question from a quiz
  const deleteQuestion = async (req, res) => {
    try {
      const { courseId, quizId, qid, questionId } = req.params;
      const resolvedQuizId = quizId || qid;
      const result = await daoDeleteQuestion(courseId, resolvedQuizId, questionId);
      return res.json(result);
    } catch (err) {
      if (err && typeof err.message === "string") {
        if (err.message.includes("Course or Quiz not found")) {
          return res.status(404).json({ error: err.message });
        }
        if (err.message.includes("Question not found")) {
          return res.status(404).json({ error: err.message });
        }
      }
      return res.status(500).json({ error: "Failed to delete question" });
    }
  };

  const createQuizForCourse = async (req, res) => {
    console.log('----Quiz Routes create Quiz For Course------');
    const { courseId } = req.params;
    const quiz = { ...req.body, };
    const newQuiz = await daoCreateQuiz(courseId, quiz);
    res.send(newQuiz);
  }
  const deleteQuiz = async (req, res) => {
    const { courseId, quizId } = req.params;
    const status = await daoDeleteQuiz(courseId, quizId);
    res.send(status);
  }
  const updateQuiz = async (req, res) => {
    console.log('---Quiz Routes----')
    const { courseId, quizId } = req.params;
    const quizUpdates = req.body;
    const status = await daoUpdateQuiz(courseId, quizId, quizUpdates);
    console.log('Sent routes to dao')
    res.send(status);
  }

  // Route handler function
  const updateQuizPublishStatus = async (req, res) => {
    try {
      const { courseId, qid } = req.params;
      const { published } = req.body;
      const result = await daoUpdateQuizPublishStatus(courseId, qid, published);
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.json({ success: true, published });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update quiz publish status' });
    }
  };
  app.put("/api/quizzes/:qid/publish", updateQuizPublishStatus);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.delete("/api/courses/:courseId/quizzes/:quizId", deleteQuiz);
  app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);
  // Questions (support both :quizId and :qid param names)
  app.post("/api/courses/:courseId/quizzes/:quizId/questions", createQuestion);
  app.post("/api/courses/:courseId/quizzes/:qid/questions", createQuestion);
  app.delete("/api/courses/:courseId/quizzes/:quizId/questions/:questionId", deleteQuestion);
  app.delete("/api/courses/:courseId/quizzes/:qid/questions/:questionId", deleteQuestion);

}
