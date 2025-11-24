import UsersDao from "./dao.js";
//import db from "../Database/index.js";
import * as coursesDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => { };
  const findUserById = (req, res) => { };
  
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
 
  app.delete("/api/users/:userId", deleteUser);

  const signup = async(req, res) => { 
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
        res.status(400).json({ message: "Username already in use" });
        return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
    
    const signin = async(req, res) => { 
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        }
        else {
            res.status(401).json({ message:"Unable to login. Try again later." });
        } 
   };

    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];

        if (!currentUser) {
            console.log(`[SERVER] Profile access failed. No currentUser found in session.`);
            res.sendStatus(401);
            return;
        }
        console.log(`[SERVER] Profile access successful for user: ${currentUser.username}`);
        res.json(currentUser);
    };
    
    const updateUser = async(req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const findMyEnrolledCourses = async(req, res) => {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
    // Find all courses the user is enrolled in
    //用dao,不用local DB.首先在Dao里implement这个function
    // const enrolledCourses = db.courses.filter(course => 
    //     db.enrollments?.some(e => 
    //         e.user === currentUser._id && e.course === course._id
    //     )
    // );
try {
      const enrolledCourses = await coursesDao.findCoursesForEnrolledUser(currentUser._id);
      res.json(enrolledCourses);
}catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.sendStatus(500);
  }
};

// const enrollInCourse = (req, res) => {
//     const currentUser = req.session["currentUser"];
//     if (!currentUser) {
//         res.sendStatus(401);
//         return;
//     }
//     const course = req.body;
//     // Add enrollment logic here
//     const newEnrollment = {
//         _id: new Date().getTime().toString(),
//         user: currentUser._id,
//         course: course._id
//     };
//     db.enrollments = [...(db.enrollments || []), newEnrollment];
//     res.json(course);
// };
const enrollInCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    const {courseId} = req.body;
    if (!courseId) {
    res.status(400).json({ error: "courseId is required" });
    return;
  }
    try {
    const enrollment = await enrollmentsDao.enrollUserInCourse(
      currentUser._id,
      courseId
    );

    // You can choose what to return: the enrollment, or just { ok: true }
    res.json(enrollment);
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.sendStatus(500);
  }
};


  //sign in & sign up: credentials go in the body, not the URL
  app.post("/api/users/signup", signup); //more secure to use "post" for credential info
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users/current/courses", findMyEnrolledCourses);
  app.post("/api/users/current/courses", enrollInCourse);
 

}

