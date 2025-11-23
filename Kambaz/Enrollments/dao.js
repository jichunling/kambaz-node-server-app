import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function EnrollmentsDao() {
  async function findCoursesForUser(userId) {
    //populate("course") is like a SQL JOIN 
    //it replaces the course ID with the full course document from the courses collection.
    const enrollments = await model.find({ user: userId }).populate("course");
    //Extract just the course from each enrollment
   return enrollments.map((enrollment) => enrollment.course);
  //   const { enrollments } = db;
  //   return enrollments.filter((e) => e.user === userId);
   }
  
   async function findUsersForCourse(courseId) {
   const enrollments = await model.find({ course: courseId }).populate("user");
   return enrollments.map((enrollment) => enrollment.user);
 }

async function enrollUserInCourse(userId, courseId) {
  //id 是combination of userId & courseId
  //这个可以确保同个user只可以enroll同个课程一次
    const enrollment = await model.create({user: userId,course: courseId, _id: `${userId}-${courseId}`});
    console.log('Created enrollment:', enrollment); 
    return enrollment;
    // const { enrollments } = db;
    // const newEnrollment = {
    //   _id: uuidv4(),
    //   user: userId,
    //   course: courseId
    // };
    // enrollments.push(newEnrollment);
    // return newEnrollment;  // ← Add return
  }

  async function unenrollUserFromCourse(user, course) {
    console.log('DAO: Attempting to delete user: ', { user}, ' course: ', {course} );
    const result = await model.deleteOne({ user, course });
    console.log('DAO: Delete result:', result);
    console.log('Deleted count:', result.deletedCount);
    return result;

    // const { enrollments } = db;
    // const index = enrollments.findIndex(
    //   (e) => e.user === userId && e.course === courseId
    // );
    // if (index !== -1) {
    //   enrollments.splice(index, 1);
    // }
  }

   async function unenrollAllUsersFromCourse(courseId) {
    console.log('DAO: Attempting to delete all user from courseID: ', {courseId} );
    const result = await model.deleteMany({ course: courseId });
    console.log('DAO: Succeseful delete all user from courseID: ', {courseId} );
    return result;
  }

  return {   
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse, 
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse
  };
}