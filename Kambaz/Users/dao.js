import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function UsersDao() {

//Creating Users
const createUser = (user) => {
   const newUser = { ...user, _id: uuidv4() };
   //users = [...users, newUser];
   return model.create(newUser);
 };

 //Finding Users
const findAllUsers = () => model.find();//All data in the users collection. return an array even it's empty

const findUserById = (userId) => model.findById(userId);//just return an object. 

const findUserByUsername = (username) => model.findOne({ username: username });//because username is unique
   //users.find((user) => user.username === username);

const findUserByCredentials = (username, password) => model.findOne({ username, password });
   // users.find((user) =>
   //    user.username === username &&
   //    user.password === password);


//Update, Delete, Return DAO API
const updateUser = (userId, user) =>
   model.updateOne({ _id: userId }, { $set: user }); //也可以用model.findByIdAndUpdate(userId, user, {new, true});
     //(users = users.map((u) => (u._id === userId ? user : u)));

 const deleteUser = (userId) =>
   model.deleteOne({ _id: userId });//也可以用model.findByIdAndDelete({_id: userId});
    // (users = users.filter((u) => u._id !== userId));

 return {
   createUser, findAllUsers, findUserById,
   findUserByUsername, findUserByCredentials,
   updateUser, deleteUser
};}
