import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollementModel from "../Enrollments/model.js"

export default function CoursesDao() {
    //model.find() returns a Promise, not data 
    //If the function isn't async, the route handler might be 
    //sending the Promise object instead of waiting for the actual data, 
    //causing it to use old cached results.
    //遇到错误❌：MongoDB 把名字改成 "Rocket", 但是 the API is showing old data. 
    //This means the backend is serving cached/stale data.
    //解决方法：用 asnyc. Without async, the function returns the Promise immediately without the "await" in the DAO having any effect. 
    async function findAllCourses() {
        //return db.courses;
        return model.find({}, {name: 1, description: 1});//无需用await㊗️
    }

    async function findCoursesForEnrolledUser(userId) {

        const  enrollments  = await enrollementModel.find();
        //const courses = await model.find({}, {name: 1, description: 1});
        const courses = await model.find({}, {name: 1, description: 1}).populate('course', 'name description number');


    // Find the specific course you updated
    const testCourse = courses.find(c => c._id === 'RS101');
    console.log('🔥 Course RS101 name in myCourses query:', testCourse?.name);
    

        console.log('🔍 Debug findCoursesForEnrolledUser:');
        console.log('userId:', userId);
        console.log('enrollments:', enrollments);
        console.log('courses count:', courses.length);
        //必需用await㊗️Because you need to do something with the data (call .filter() on it). 
        //You can't filter a Promise - you need the actual array.
        const enrolledCourses = courses.filter((course) => 
            enrollments.some((enrollment) =>
                enrollment.user === userId && enrollment.course === course._id));
        console.log('enrolledCourses count:', enrolledCourses.length);
        return enrolledCourses;

    // //     console.log('🔍 Debug findCoursesForEnrolledUser:', userId);

    // // // 1. Find all enrollment records for the specific user ID
    // // const enrollments = await enrollementModel.find({ user: userId })
    //     // 2. Use populate() to fetch the actual course documents linked by the course ID
    //     .populate('course', 'name description number'); 
    //     // Note: 'course' should match the field name in your enrollment schema that stores the Course ID.
    //     // The second argument ('name description number') limits the fields returned.

    // // 3. Extract the course objects from the enrollment documents
    // const enrolledCourses = enrollments.map(enrollment => enrollment.course);
    
    // console.log('enrolledCourses count:', enrolledCourses.length);
    // return enrolledCourses;
    }
    

    //without async and await:
    //It starts saving but doesn't wait and returns undefined immediately!
    async function createCourse(course) {
        const newCourse = { ...course, _id: uuidv4() };
        const createdCourse = await model.create(newCourse);
        // db.courses = [...db.courses, newCourse];
        //     return newCourse;
        return createdCourse;  
    }
    async function deleteCourse(courseId) {
         const status = model.deleteOne({ _id: courseId });
         return status;
        // const { enrollments } = db;
        // db.enrollments = enrollments.filter((enrollment) => enrollment.course !== courseId );
        // const result = await model.deleteOne({ _id: courseId });
        // return result;
    }
    //㊗️这里没有加async/await
    async function updateCourse(courseId, courseUpdates) {
        // const { courses } = db;
        // const course = courses.find((course) => course._id === courseId);
        // Object.assign(course, courseUpdates);
        // return course;
        const result = model.updateOne({ _id: courseId },{ $set: courseUpdates });
        return result;
    }




    return { findAllCourses, findCoursesForEnrolledUser, createCourse, deleteCourse, updateCourse };
}
