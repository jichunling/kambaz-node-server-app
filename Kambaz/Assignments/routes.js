import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();

  const findAssignmentsForCourse = async(req, res) => {
    console.log('----Assignments Routes------');
    console.log('🔍 Route params:', req.params);
    console.log('🔍 Course ID:', req.params.courseId);
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    console.log('🔍 Assignments found:', assignments);
    console.log('🔍 Count:', assignments.length);
    res.json(assignments);
  }
  const createAssignmentForCourse = async(req, res) => {
    console.log('🪐----Hitting Assignment Routes createAssignmentForCourse----');
    const { courseId } = req.params;
    const assignment = {...req.body};
    const newAssignment = await dao.createAssignment(courseId, assignment);
    console.log('After calling dao');
    res.send(newAssignment);
}
const deleteAssignment = async(req, res) => {
  console.log('----Assignments Routes deleteAssignment------');
  const { courseId, assignmentId } = req.params; 
  console.log('🔍 CourseID:', courseId);
  console.log('🔍 assignmentId:', assignmentId);
  const status = await dao.deleteAssignment(courseId, assignmentId);
  res.send(status);
}
const updateAssignment = async (req, res) => {
  const { courseId, assignmentId } = req.params;
  const assignmentUpdates = req.body;
  const status = await dao.updateAssignment(courseId, assignmentId, assignmentUpdates);
  res.send(status);
}
//get assignment by ID
const findAssignmentById = async(req, res) => {
   console.log("=== ROUTES: findAssignmentById called ===");
   console.log("Full req.params:", req.params);
   console.log("assignmentId from params:", req.params.assignmentId);
    const { assignmentId } = req.params;
    console.log("Extracted assignmentId:", assignmentId);
    const assignment = await dao.findAssignmentById(assignmentId); // ← FIXED: Remove dao.assignments and .find()
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  };


app.get("/api/assignments/:assignmentId", findAssignmentById); 
app.get("/api/courses/:courseId/assignments",findAssignmentsForCourse);
app.post("/api/courses/:courseId/assignments",createAssignmentForCourse);
app.delete("/api/courses/:courseId/assignments/:assignmentId", deleteAssignment);
app.put("/api/courses/:courseId/assignments/:assignmentId", updateAssignment);


}
