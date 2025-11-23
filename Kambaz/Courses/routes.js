
import CoursesDao from "./dao.js";
import * as moduleDao from "../Modules/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();
  
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  }

const createCourse = async(req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {console.log("currentUser works");}
  else {console.log("Null: currentUser works")}
  const newCourse =  await dao.createCourse(req.body);
  enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
  res.json(newCourse);//only response the new course, not all courses
};
const deleteCourse = async(req, res) => {
  const { courseId } = req.params;
  await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
  const status =  await dao.deleteCourse(courseId);
  res.send(status);
}
const updateCourse = async(req, res) => {
  const { courseId } = req.params;
  const courseUpdates = req.body;
  const status = await dao.updateCourse(courseId, courseUpdates);
  res.send(status);
}
const findCoursesForEnrolledUser = async (req, res) => {
  const { userId } = req.params;
  if (userId === "current") {
    let currentUser = req.session["currentUser"];
   if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    userId = currentUser._id;
  }
  const courses = await dao.findCoursesForEnrolledUser(userId);
  console.log(courses);
  res.json(courses);
};
const findModulesForCourse = async (req, res) => {};

const createModuleForCourse = async(req, res) => {
    const { courseId } = req.params;
    const module = {...req.body, course: courseId};
    const newModule = await moduleDao.createModule(module);
    res.send(newModule);
}
const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  }
  

app.get("/api/courses", findAllCourses);
app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
app.get("/api/courses/:cid/users", findUsersForCourse);
app.post("/api/users/current/courses", createCourse);
app.delete("/api/courses/:courseId",deleteCourse);
app.put("/api/courses/:courseId", updateCourse);
app.post("/api/users/:courseId/modules", createModuleForCourse);
}