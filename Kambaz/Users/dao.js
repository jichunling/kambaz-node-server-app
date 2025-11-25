import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function UsersDao() {

//Creating Users
const createUser = async (user) => {
   const newUser = { ...user, _id: uuidv4() };
   //users = [...users, newUser];
   return await model.create(newUser);
 };

 //Finding Users
async function findAllUsers() {
   return await model.find();}//All data in the users collection. return an array even it's empty

 const findUserById = async(userId) => await model.findById(userId);//just return an object. 
 const findUsersByRole = async (role) => await model.find({ role: role });
 const findUserByUsername = async (username) => { 
   console.log('----Users DAO findUserByUsername-----');
   console.log('username: ', {username})
   return await model.findOne({ username: username });//because username is unique
   
   }

 const findUserByCredentials = async (username, password) => await model.findOne({ username, password });
   // users.find((user) =>
   //    user.username === username &&
   //    user.password === password);

 const updateUser = async (userId, user) =>{
   console.log('---Users DAO update User----', userId, user);
   return await model.findByIdAndUpdate(
    userId, user,  { new: true }   // return the updated version
  ); //也可以用model.findByIdAndUpdate(userId, user, {new, true});
   
};
 const deleteUser = async (userId) =>
    await model.deleteOne({ _id: userId });//也可以用model.findByIdAndDelete({_id: userId});
    // (users = users.filter((u) => u._id !== userId));

 const findUsersByPartialName = async (partialName) => {
  const regex = new RegExp(partialName, "i");
  // 'i' makes it case-insensitive
  return await model.find({
    $or: [{ firstName: { $regex: regex } },
          { lastName:  { $regex: regex } }],
  });
};

 return {
   createUser, findAllUsers, findUserById,
   findUserByUsername, findUserByCredentials,
   updateUser, deleteUser, findUsersByRole,
   findUsersByPartialName,
};}
