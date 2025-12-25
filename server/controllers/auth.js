import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register=async(request, response)=>{
    try {
        const {
            fullname,
            email,
            password
        } = request.body;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        });
        const savedUser = await newUser.save();
        response.status(200).send(savedUser);
    } catch (error) {
        console.log(error);
    }
};


export const login=async(request, response)=>{
    try {
        const {email, password} = request.body;
        const user = await User.findOne({email:email});

        if(!user) return response.status(404).send("User not found");
        const matched = await bcrypt.compare(password, user.password);

        if(!matched) return response.status(401).send("Incorrect Credentials");
        const token =jwt.sign({id:user._id}, process.env.JWT_SECRET);
        delete user.password;
        response.status(200).json({token, user});
    } catch (error) {
        console.log(error);
    }
};