import { v4 as uuidv4 } from "uuid";
import model from "./model.js"
import courseModel from "../Courses/model.js"

export default function AssignmentsDao() {
  async function createAssignment(courseId, assignment) {
    console.log('----Hitting AssignmentDao createAssignment----');
    console.log('Received assignment data:', JSON.stringify(assignment, null, 2));  
    if (!assignment.name) {
        throw new Error('Assignment name is required');
    }
    const newAssignment = {...assignment, _id:uuidv4()};
    console.log('newAssignment id: ', newAssignment._id);
    console.log('newAssignment full:', JSON.stringify(newAssignment, null, 2)); 
    
    const status = await courseModel.updateOne( { _id: courseId },{ $push: { assignments: newAssignment } });
    console.log('Create Assignment Status', status);
    return newAssignment;
  
    
 };
 async function findAssignmentsForCourse(courseId) {
  console.log("DAO: Looking for assignments for course:", courseId);
  const course = await courseModel.findById(courseId);
  const assignments = course.assignments;
  console.log("DAO: Found assignments:", assignments);
  return assignments;

 }
 async function deleteAssignment(courseId, assignmentId) {
  console.log('----Assignments DAO deleteAssignment------');
  const course = await courseModel.updateOne({_id: courseId}, { $pull: {assignments: {_id: assignmentId}}});
  console.log('Successful deteled');
  return course;
  // const assignments = model.find();
  //db.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
  //return {status: "ok"};
}

async function updateAssignment(courseId, assignmentId, assignmentUpdates) {
  console.log('----Assignment DAO updateAssignment----')
  const course = await courseModel.findById(courseId);
  const assignment = course.assignments.id(assignmentId);

  if (!assignment) {
    throw new Error(`Assignment with id ${assignmentId} not found`);
  }
    Object.assign(assignment, assignmentUpdates);
    const result = await course.save();
    console.log('Save result', result);
    return assignment;
}
async function findAssignmentById(assignmentId) {
  console.log("DAO: Looking for assignments in course:", assignmentId);
   const course = await courseModel.findOne(
    { "assignments._id": assignmentId }, // match embedded assignment by id
    { "assignments.$": 1 }               // projection: only the matching element
  ).lean();
  if (!course || !course.assignments || course.assignments.length === 0) {
    console.log("DAO: Assignment not found");
    return null;
  }

  const assignment = course.assignments[0];
  console.log("DAO: Found assignment:", assignment);
  return assignment;
 }


 return {
   createAssignment, findAssignmentsForCourse, deleteAssignment,updateAssignment, findAssignmentById
 };
}
