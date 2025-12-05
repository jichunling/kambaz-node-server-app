import { v4 as uuidv4 } from "uuid";
import courseModel from "../Courses/model.js";


 export async function createQuiz(courseId, quiz) {
  console.log('---inside Quiz Dao create Quiz---')
   const newQuiz = { ...quiz, _id: uuidv4() };
   const status = await courseModel.updateOne( { _id: courseId },{ $push: { quizzes: newQuiz } });
   return newQuiz;
 }

 //whenever we are talking to the model, we need "async" "await"
 export async function findQuizzesForCourse(courseId) {
   console.log('---inside Quiz Dao findQuizzesForCourse---');
   const course = await courseModel.findById(courseId);
   console.log('course is', course._id);
   return course.quizzes;
 }

 export async function deleteQuiz(courseId, quizId) {
  const status = await courseModel.updateOne(
     { _id: courseId },
     { $pull: { quizzes: { _id: quizId } } }
   );
   return status;
}
export async function updateQuiz(courseId, quizId, quizData) {
  console.log('-----Quiz DAO update Quiz----');
  console.log('courseId:', courseId);
  console.log('quizId:', quizId);
  console.log('quizData:', quizData);

  // ✅ Build dynamic $set object for any fields in quizData
  const setFields = {};
  
  // List of all possible quiz fields that can be updated
  const updatableFields = [
    'title', 'type', 'points', 'assignmentGroup', 'description', 'published',
    'shuffleAnswer', 'timeLimit', 'multipleAttempts', 'showCorrectAnswers', 
    'accessCode', 'oneQuestionAtATime', 'webcamRequired', 'lockQuestionAfterAsnwering',
    'dueDate', 'availableFrom', 'availableUntil', 'until'
  ];
  
  // ✅ Dynamically add any fields that exist in quizData
  updatableFields.forEach(field => {
    if (quizData[field] !== undefined && quizData[field] !== null) {
      setFields[`quizzes.$.${field}`] = quizData[field];
    }
  });
  
  console.log('🔍 Fields to update:', setFields);
  
  // ✅ Update using model.updateOne with dynamic fields
  const result = await courseModel.updateOne(
    { 
      _id: courseId,           
      "quizzes._id": quizId    
    },
    { $set: setFields }  // ✅ Dynamic set object
  );

  console.log('🔍 Update result:', result);
  return result;
}

export async function updateQuizPublishStatus(courseId, quizId, published) {
    console.log('----Quiz DAO updateQuizPublishStatus ---');
    const course = await courseModel.findOne({ "quizzes._id": quizId });
    console.log('🔍 Found course with quiz:', course._id);
    
    // Find the quiz index
    const quizIndex = course.quizzes.findIndex(q => q._id === quizId);
    console.log('🔍 Quiz index:', quizIndex);
    
    // Update using array index instead of positional operator
    const updateField = {};
    updateField[`quizzes.${quizIndex}.published`] = published;
    
    const result = await courseModel.updateOne(
        { _id: course._id },
        { $set: updateField }
    );
    
    console.log('DAO result:', result);
    return result;
    
}


