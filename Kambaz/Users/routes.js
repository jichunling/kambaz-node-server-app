import UsersDao from "./dao.js";
import * as coursesDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const dao = UsersDao();
  const createUser = async (req, res) => {
    console.log('---User Route create User---')
    const user = await dao.createUser(req.body);
    console.log('After User Route create User: ', user._id);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await
        dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);

  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    }
    else {
      res.status(401).json({ message: "Unable to login. Try again later." });
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

  // GET profile: returns the fresh user record for the logged-in session user
  const getProfile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    try {
      const user = await dao.findUserById(currentUser._id);
      if (!user) {
        res.sendStatus(404);
        return;
      }
      res.set("Cache-Control", "no-store");
      res.json(user);
    } catch (e) {
      console.error("Error in GET /api/users/profile:", e);
      res.sendStatus(500);
    }
  };

  const updateUser = async (req, res) => {
    console.log('---Users Routes update User---');
    const { userId } = req.params;
    const userUpdates = req.body;
    console.log('---About Calling DAO to update User', userId);
    const updatedUser = await dao.updateUser(userId, userUpdates);
    if (!updatedUser) {
      return res.sendStatus(404);
    }
    console.log('Called DAO updatedUser', updatedUser);

    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }

    res.json(updatedUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const findMyEnrolledCourses = async (req, res) => {
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
    } catch (error) {
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
    const { courseId } = req.body;
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
  app.get("/api/users/profile", getProfile);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users/current/courses", findMyEnrolledCourses);
  app.post("/api/users/current/courses", enrollInCourse);


}

