import db from "../Database/index.js";
import CoursesDao from "./dao.js";
import * as moduleDao from "../Modules/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  }

const createCourse = (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {console.log("currentUser works");}
  else {console.log("Null: currentUser works")}
  const newCourse = dao.createCourse(req.body);
  enrollmentsDao.enrollUserInCourse(
    currentUser._id,
    newCourse._id
  );
  res.json(newCourse);//only response the new course, not all courses
};
const deleteCourse = (req, res) => {
  const { courseId } = req.params;
  const status = dao.deleteCourse(courseId);
  res.send(status);
}
const updateCourse = (req, res) => {
  const { courseId } = req.params;
  const courseUpdates = req.body;
  const status = dao.updateCourse(courseId, courseUpdates);
  res.send(status);
}
const findCoursesForEnrolledUser = (req, res) => {
  let { userId } = req.params;
  if (userId === "current") {
    const currentUser = req.session["currentUser"];
   if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = dao.findCoursesForEnrolledUser(userId);
  console.log(courses);
  res.json(courses);
};
const findModulesForCourse = async (req, res) => {};

const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const module = {...req.body, course: courseId};
    const newModule = moduleDao.createModule(module);
    res.send(newModule);
}

app.get("/api/courses", findAllCourses);
app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
app.post("/api/users/current/courses", createCourse);
app.delete("/api/courses/:courseId",deleteCourse);
app.put("/api/courses/:courseId", updateCourse);
app.post("/api/users/:courseId/modules", createModuleForCourse);
}