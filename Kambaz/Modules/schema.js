import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    //lessons 可以不单独create一个file for schema
    //更professional的方式确实是create another file, 
    //就像Modules/schema一样
    lessons: [{ _id: String, name: String, description: String }],
  }
);
export default schema;
