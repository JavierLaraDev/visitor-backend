import type { User } from "../models/user.interface.js";
import jwt from "jsonwebtoken";

const JWT_SECRET= process.env.JWT_SECRET||"default-secret";

export const generateToken = (user: User) => {
    return jwt.sign({id:user.id,email:user.email,role:user.role},JWT_SECRET,{expiresIn:"1d"});
};