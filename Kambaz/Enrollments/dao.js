import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  
  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId
    };
    enrollments.push(newEnrollment);
    return newEnrollment;  // ← Add return
  }

  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
  }

  function findCoursesForUser(userId) {
    const { enrollments, courses } = db;
    const userEnrollments = enrollments.filter((e) => e.user === userId);
    return courses.filter(course => 
      userEnrollments.some(e => e.course === course._id)
    );
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    const index = enrollments.findIndex(
      (e) => e.user === userId && e.course === courseId
    );
    if (index !== -1) {
      enrollments.splice(index, 1);
    }
  }

  return { 
    enrollUserInCourse, 
    findEnrollmentsForUser,
    findCoursesForUser,
    unenrollUserFromCourse
  };
}