import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    console.log("Found assignments:", assignments);
    res.json(assignments);
  }
  const createAssignmentForCourse = (req, res) => {
  const { courseId } = req.params;
  const assignment = {
    ...req.body,
    course: courseId,
  };
  const newAssignment = dao.createAssignment(assignment);
  res.send(newAssignment);
}
const deleteAssignment = (req, res) => {
  const { assignmentId } = req.params;
  const status = dao.deleteAssignment(assignmentId);
  res.send(status);
}
const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const assignmentUpdates = req.body;
  const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
  res.send(status);
}
//get assignment by ID
const findAssignmentById = (req, res) => {
   console.log("=== ROUTES: findAssignmentById called ===");
   console.log("Full req.params:", req.params);
   console.log("assignmentId from params:", req.params.assignmentId);
    const { assignmentId } = req.params;
    console.log("Extracted assignmentId:", assignmentId);
    const assignment = dao.findAssignmentById(assignmentId); // ← FIXED: Remove dao.assignments and .find()
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  };


app.get("/api/assignments/:assignmentId", findAssignmentById); 
app.get("/api/courses/:courseId/assignments",findAssignmentsForCourse);
app.post("/api/courses/:courseId/assignments",createAssignmentForCourse);
app.delete("/api/assignments/:assignmentId", deleteAssignment);
app.put("/api/assignments/:assignmentId", updateAssignment);


}
