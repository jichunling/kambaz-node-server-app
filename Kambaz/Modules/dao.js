
import { v4 as uuidv4 } from "uuid";
import courseModel from "../Courses/model.js";

export default function ModulesDao() {
 //accept newModule as a param
 async function createModule(courseId, module) {
  console.log('---inside ModulesDao createModule---')
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
  console.log('-----Modules DAO updateModule----');
  console.log('courseId:', courseId);
  console.log('moduleId:', moduleId);
  console.log('moduleUpdates:', moduleUpdates);

  const course = await courseModel.findById(courseId); //retreat course
  console.log('Found course?', course ? 'YES' : 'NO');
  console.log('Course modules count:', course?.modules?.length);
  
  const module = course.modules.id(moduleId);
  console.log('Found module?', module ? 'YES' : 'NO');
  console.log('Module before update:', JSON.stringify(module));
  
  Object.assign(module, moduleUpdates);
  console.log('Module after update:', JSON.stringify(module));

  const result = await course.save(); //save the course back
  console.log('Save result:', result);
  console.log('Successfully update module for course: ', courseId);
  return module;

  // const { modules } = db;
  // const module = modules.find((module) => module._id === moduleId);
  // Object.assign(module, moduleUpdates);
  // return module;
}


 return { createModule, findModulesForCourse, deleteModule, updateModule };
}
