import { createQuiz as daoCreateQuiz, findQuizzesForCourse as daoFindQuizzesForCourse, 
    deleteQuiz as daoDeleteQuiz, updateQuiz as daoUpdateQuiz, 
updateQuizPublishStatus as daoUpdateQuizPublishStatus} from "../Quizzes/dao.js";


export default function QuizzesRoutes(app) {

  const findQuizzesForCourse = async(req, res) => {
    console.log('----Quiz Routes findQuizzesForCourse------');
    console.log(req.params); // Log the raw params object
    const { courseId } = req.params;
    console.log('courseId', courseId);
    const quizzes = await daoFindQuizzesForCourse(courseId);
    console.log('quizzes', {quizzes});
    res.json(quizzes);
  }
  
const createQuizForCourse = async (req, res) => {
  console.log('----Quiz Routes create Quiz For Course------');
  const { courseId } = req.params;
  const quiz = {...req.body,};
  const newQuiz = await daoCreateQuiz(courseId, quiz);
  res.send(newQuiz);
}
const deleteQuiz = async (req, res) => {
  const { courseId, quizId } = req.params;
  const status = await daoDeleteQuiz(courseId, quizId);
  res.send(status);
}
const updateQuiz =  async (req, res) => {
    console.log('---Quiz Routes----')
    const { courseId, quizId } = req.params;
    const quizUpdates = req.body;
    const status =  await daoUpdateQuiz(courseId, quizId, quizUpdates);
    console.log('Sent routes to dao')
    res.send(status);
  }
  
// Route handler function
const updateQuizPublishStatus = async (req, res) => {
    try {
        console.log('----Quiz Route---');
        const { courseId, qid } = req.params;
        const { published } = req.body;
        
        console.log('Quiz ID:', qid);
        console.log('New published status:', published);
        console.log('🔵 About to call DAO function...');
        const result = await daoUpdateQuizPublishStatus(courseId, qid, published);
        console.log('🟢 DAO function returned:', result);

        console.log('🔍 Checking modifiedCount:', result?.modifiedCount);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        
        console.log('✅ Quiz publish status updated successfully');
        res.json({ success: true, published });
    } catch (error) {
        console.error('❌ Error updating quiz publish status:', error);
        res.status(500).json({ error: 'Failed to update quiz publish status' });
    }
};
app.put("/api/quizzes/:qid/publish", updateQuizPublishStatus);
app.post("/api/courses/:courseId/quizzes",createQuizForCourse);
app.get("/api/courses/:courseId/quizzes",findQuizzesForCourse);
app.delete("/api/courses/:courseId/quizzes/:quizId",deleteQuiz);
app.put("/api/courses/:courseId/quizzes/:quizId", updateQuiz);

}
