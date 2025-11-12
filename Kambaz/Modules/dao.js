import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
 //accept newModule as a param
 function createModule(module) {
    const newModule = {...module, _id:uuidv4()};
    Database.modules = [...Database.modules, newModule];
    return newModule;
 }
 function findModulesForCourse(courseId) {
   const { modules } = db;
   return modules.filter((module) => module.course === courseId);
 }
 function deleteModule(moduleId) {
  const { modules } = db;
  db.modules = modules.filter((module) => module._id !== moduleId);
}
function updateModule(moduleId, moduleUpdates) {
  const { modules } = db;
  const module = modules.find((module) => module._id === moduleId);
  Object.assign(module, moduleUpdates);
  return module;
}


 return { createModule, findModulesForCourse, deleteModule, updateModule };
}
