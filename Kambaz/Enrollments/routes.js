import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Get current user's enrolled courses
  app.get("/api/users/current/courses", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const courses = dao.findCoursesForUser(currentUser._id);
    res.json(courses);
  });

  // Enroll current user in a course
  app.post("/api/users/current/courses", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { _id: courseId } = req.body;
    dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(req.body);
  });

  app.delete("/api/users/current/courses/:courseId", (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  const { courseId } = req.params;
  dao.unenrollUserFromCourse(currentUser._id, courseId);
  res.json({ status: "ok" });
});
}