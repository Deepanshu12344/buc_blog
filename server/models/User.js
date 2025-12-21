import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    firstname:{
        type:String,
        required: true,
        min:2,
        max:50
    },
    lastname:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        max:50,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:5
    }
},{timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;