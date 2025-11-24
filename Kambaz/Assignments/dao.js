import { v4 as uuidv4 } from "uuid";
import model from "./model.js"
import courseModel from "../Courses/model.js"

export default function AssignmentsDao() {
  async function createAssignment(assignment) {
    console.log('----AssignmentDao createAssignment----')
    const newAssignment = {...assignment, _id:uuidv4()};
    console.log('newAssignment id: ', newAssignment._id);
    const createdAssignment = await model.create(newAssignment);
    console.log('After Creating Assignment')
    return createdAssignment;
    //Database.assignments = [...Database.assignments, newAssignment];
    
 };
 async function findAssignmentsForCourse(courseId) {
  console.log("DAO: Looking for assignments for course:", courseId);
  const course = await courseModel.findById(courseId);
  const assignments = course.assignments;
  console.log("DAO: Found assignments:", assignments);
  return assignments;

 }
 function deleteAssignment(assignmentId) {
  const assignments = model.find();
  db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
  return {status: "ok"};
}
function updateAssignment(assignmentId, assignmentUpdates) {
  const assignments = model.find();
  const assignment = assignments.find((assignment) =>
    assignment._id === assignmentId);
  if (!assignment) {
    throw new Error(`Assignment with id ${assignmentId} not found`);
  }
    Object.assign(assignment, assignmentUpdates);
    return assignment;
}
function findAssignmentById(assignmentId) {
  console.log("DAO: Looking for assignments in course:", assignmentId);
   const assignments = model.find();
   console.log("DAO: Found all assignments:", assignments);
    const result = assignments.filter((assignment) => assignment._id === assignmentId);
    console.log("DAO: Found assignments:", result);
    return result;
 }


 return {
   createAssignment, findAssignmentsForCourse, deleteAssignment,updateAssignment, findAssignmentById
 };
}
