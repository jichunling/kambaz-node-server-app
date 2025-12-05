//require == import
//const express = require('express'); // load express
import cors from "cors";
import express from "express"
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js"
import PathParameters from "./Lab5/PathParameters.js"
import QueryParameters from "./Lab5/QueryParameters.js"
import WorkingWithObjects from "./Lab5/WorkingWithObjects.js"
import WorkingWithArrays from "./Lab5/WorkingWithArrays.js"
import "dotenv/config";
import session from "express-session";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from  "./Kambaz/Enrollments/routes.js";
import QuizzesRoutes from  "./Kambaz/Quizzes/routes.js";
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
console.log(
  "MongoDB connection string prefix:",
  CONNECTION_STRING.split("@")[0]
);
mongoose.connect(CONNECTION_STRING)
.then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
  });;

const app = express();      // create instance

//1. CORS Configuration (Who Can Talk to Me)
//It tells the browser that only requests coming from this specific domain (the client's URL) 
//should be allowed to access the server's resources. During development, 
// it defaults to http://localhost:3000
//It intercepts the requests and, if the origin violates the rule set by the origin property, 
//the CORS middleware will instruct the browser to block the request and throw a CORS error. It acts as a gatekeeper.
//credentials: true: This is essential for authentication. 
// It tells the browser and the server that HTTP requests are allowed to include credentials 
// (like cookies or HTTP authentication headers)
app.use(cors({credentials: true,   
    origin: process.env.CLIENT_URL ||"http://localhost:3000",
}));

app.set("trust proxy", 1);// Trust proxy (important for secure cookies on Render/HTTPS)

const isProduction = process.env.NODE_ENV === "production";
//2. Session Configuration (Making HTTP State-Aware)
//Manage user sessions, making the stateless HTTP protocol "remember" the user.
//A. Local/Development Configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false, //Tells the session store not to save the session back to the store if it wasn't modified during the request. This is a performance optimization.
  saveUninitialized: false, 
  //prevents a session cookie from being created for users who haven't done anything yet 
  // (i.e., the session object is empty). It saves space and bandwidth.
};
//B. Remote/Production Configuration (The Cross-Domain Challenge)
//This conditional block is crucial for deploying the application 
//where the server and client are on different domains (a common setup).
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true; //tells the session middleware to trust the proxy's secure headers.
  //For the browser to send the session cookie across different domains 
  // (which is required since the frontend and backend domains are separate).
  sessionOptions.cookie = {
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    //domain: process.env.SERVER_URL,
    //don't set domain to SERVER_URL – that breaks cookies
    // domain should be just the backend host if you ever use it,
    // but we can omit it and let the browser handle it:
    // domain: "kambaz-node-a6.onrender.com",
  };
}
//C. Applying the Middleware
app.use(session(sessionOptions)); //create a session obj
//In short, this combined configuration guarantees that your frontend (Client) can securely communicate with your backend (Server) 
//using cookies to maintain the user's authenticated session, regardless of whether you are running locally or deployed remotely.




app.use(express.json()); 
//When a client (like your React app) sends a POST or PUT request to your server, 
// the data is typically sent in the request body as a JSON string
//1. Intercepts Request: The "express.json" intercepts every incoming request.
//2. Parses JSON: It checks the Content-Type header of the request. If it's application/json, 
//it takes the raw JSON text body and attempts to convert it into a usable JavaScript object.
//3. Attaches to Request: It then attaches this resulting JavaScript object to the req.body property of the request object.

Hello(app);
UserRoutes(app);
EnrollmentsRoutes(app);
CourseRoutes(app);
ModulesRoutes(app);
AssignmentsRoutes(app);
QuizzesRoutes(app);

Lab5(app);
PathParameters(app);
QueryParameters(app);
WorkingWithObjects(app);
WorkingWithArrays(app);
//app.listen(process.env.PORT ||4000);   原来

// ✅ Render will inject PORT; fallback for local dev
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
//In Production (Deployment): When you deploy a web application 
// (e.g., to platforms like Heroku, Vercel, or AWS), 
// the hosting environment often automatically defines 
// the PORT variable (usually something like 80 or a high-number port 
// like 3000 or 5000) that the application must listen on. 
// Using process.env.PORT ensures your application works correctly in these hosted environments.  
