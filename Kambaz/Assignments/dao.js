import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
function createAssignment(assignment) {
    const newAssignment = {...assignment, _id:uuidv4()};
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
 };
 function findAssignmentsForCourse(courseId) {
  console.log("DAO: Looking for assignments in course:", courseId);
   const { assignments } = db;
   console.log("DAO: Found all assignments:", assignments);
    const result = assignments.filter((assignment) => assignment.course === courseId);
    console.log("DAO: Found assignments:", result);
    return result;
 }
 function deleteAssignment(assignmentId) {
  const { assignments } = db;
  db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
  return {status: "ok"};
}
function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = db;
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
   const { assignments } = db;
   console.log("DAO: Found all assignments:", assignments);
    const result = assignments.filter((assignment) => assignment._id === assignmentId);
    console.log("DAO: Found assignments:", result);
    return result;
 }


 return {
   createAssignment, findAssignmentsForCourse, deleteAssignment,updateAssignment, findAssignmentById
 };
}
