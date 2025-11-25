import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollementModel from "../Enrollments/model.js"


    //model.find() returns a Promise, not data 
    //If the function isn't async, the route handler might be 
    //sending the Promise object instead of waiting for the actual data, 
    //causing it to use old cached results.
    //遇到错误❌：MongoDB 把名字改成 "Rocket", 但是 the API is showing old data. 
    //This means the backend is serving cached/stale data.
    //解决方法：用 asnyc. Without async, the function returns the Promise immediately without the "await" in the DAO having any effect. 
    export async function findAllCourses() {
        //return db.courses;
        return model.find({}, {name: 1, description: 1});//无需用await㊗️
    }

    export async function findCoursesForEnrolledUser(userId) {
        console.log('-------Hitting Course DAO findCoursesForEnrolledUser--------');
        //不需要全部的enrollment
        const  enrollments  = await enrollementModel.find();
        const courses = await model.find({}, {name: 1, description: 1});

        console.log('🔍 Debug findCoursesForEnrolledUser:');
        console.log('userId:', userId);
        console.log('Total enrollments count:', enrollments.length);
        console.log('Total courses count:', courses.length);
        //必需用await㊗️Because you need to do something with the data (call .filter() on it). 
        //You can't filter a Promise - you need the actual array.
        const enrolledCourses = courses.filter((course) => 
            enrollments.some((enrollment) =>
                enrollment.user === userId && enrollment.course === course._id));
        console.log('User enrolled courses count:', enrolledCourses.length);
         return enrolledCourses;
    }
    

    //without async and await:
    //It starts saving but doesn't wait and returns undefined immediately!
    export async function createCourse(course) {
        console.log('-------Hitting Course DAO createCourse--------');
        const cleanCourse = { ...course, assignments: [] };
        const newCourse = await model.create(cleanCourse);
        return newCourse;
        // const newCourse = { ...course, _id: uuidv4() };
        // const cousreID = newCourse._id;
        // console.log('courseID: ', {cousreID});
        // const createdCourse = await model.create(newCourse);
        // console.log('After creating course: ', newCourse.name );
        // return createdCourse;  
    }
    export async function deleteCourse(courseId) {
         const status = model.deleteOne({ _id: courseId });
         return status;
        // const { enrollments } = db;
        // db.enrollments = enrollments.filter((enrollment) => enrollment.course !== courseId );
        // const result = await model.deleteOne({ _id: courseId });
        // return result;
    }
    //㊗️这里没有加async/await
    export async function updateCourse(courseId, courseUpdates) {
        // const { courses } = db;
        // const course = courses.find((course) => course._id === courseId);
        // Object.assign(course, courseUpdates);
        // return course;
        const result = model.updateOne({ _id: courseId },{ $set: courseUpdates });
        return result;
    }

   // return { findAllCourses, findCoursesForEnrolledUser, createCourse, deleteCourse, updateCourse };

