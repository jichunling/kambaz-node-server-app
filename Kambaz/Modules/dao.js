import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import courseModel from "../Courses/model.js";

export default function ModulesDao() {
 //accept newModule as a param
 async function createModule(courseId, module) {
   const newModule = { ...module, _id: uuidv4() };
   const status = await courseModel.updateOne( { _id: courseId },{ $push: { modules: newModule } });
   return newModule;

    // const newModule = {...module, _id:uuidv4()};
    // Database.modules = [...Database.modules, newModule];
    // return newModule;
 }

 //whenever we are talking to the model, we need "async" "await"
 async function findModulesForCourse(courseId) {
   const course = await courseModel.findById(courseId);
   return course.modules;
  //  const { modules } = db;
  //  return modules.filter((module) => module.course === courseId);
 }

 async function deleteModule(courseId, moduleId) {
  const status = await courseModel.updateOne(
     { _id: courseId },
     { $pull: { modules: { _id: moduleId } } }
   );
   return status;

  // const { modules } = db;
  // db.modules = modules.filter((module) => module._id !== moduleId);
}
async function updateModule(courseId, moduleId, moduleUpdates) {
  const course = await courseModel.findById(courseId); //retreat course
  const module = course.modules.id(moduleId);
  Object.assign(module, moduleUpdates);
  await course.save(); //save the course back
  return module;

  // const { modules } = db;
  // const module = modules.find((module) => module._id === moduleId);
  // Object.assign(module, moduleUpdates);
  // return module;
}


 return { createModule, findModulesForCourse, deleteModule, updateModule };
}
