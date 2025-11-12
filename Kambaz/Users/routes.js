import UsersDao from "./dao.js";
import db from "../Database/index.js";
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => { };
  const findUserById = (req, res) => { };
  
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
 
  app.delete("/api/users/:userId", deleteUser);

  const signup = (req, res) => { 
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
        res.status(400).json({ message: "Username already in use" });
        return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
    
    const signin = (req, res) => { 
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
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
    
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const findMyEnrolledCourses = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    // Find all courses the user is enrolled in
    const enrolledCourses = db.courses.filter(course => 
        db.enrollments?.some(e => 
            e.user === currentUser._id && e.course === course._id
        )
    );
    res.json(enrolledCourses);
};

const enrollInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
        res.sendStatus(401);
        return;
    }
    const course = req.body;
    // Add enrollment logic here
    const newEnrollment = {
        _id: new Date().getTime().toString(),
        user: currentUser._id,
        course: course._id
    };
    db.enrollments = [...(db.enrollments || []), newEnrollment];
    res.json(course);
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

