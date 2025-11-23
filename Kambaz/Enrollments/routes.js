import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();
  
  const findCoursesForEnrolledUser = async (req, res) => {
   let { userId } = req.params;
   if (userId === "current") {
     const currentUser = req.session["currentUser"];
     if (!currentUser) {
       res.sendStatus(401);
       return;
     }
     userId = currentUser._id;
   }
   const courses = await dao.findCoursesForUser(userId);
   res.json(courses);
 };

 //暂时
  // Get current user's enrolled courses
  // app.get("/api/users/current/courses", (req, res) => {
  //   const currentUser = req.session["currentUser"];
  //   if (!currentUser) {
  //     res.sendStatus(401);
  //     return;
  //   }
  //   const courses = dao.findCoursesForUser(currentUser._id);
  //   res.json(courses);
  // });

  // Enroll current user in a course
  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await dao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
        console.log('🔴 Unenroll route hit!');
        console.log('params:', req.params);
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      uid = currentUser._id;
    }
    const status = await dao.unenrollUserFromCourse(uid, cid);
    res.send(status);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
  };

app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
app.delete("/api/users/:uid/courses/:cid",unenrollUserFromCourse);
app.get("/api/users/current/courses", findCoursesForEnrolledUser);
}