import type { Role } from "@prisma/client";
import validator from "validator";

export const validateUserData= (email: string, password: string, role: Role):string | null => {
    if (!email) return "Email address is required";
    if (!password) return "The password is required";
    if (!validator.isEmail(email)) return "Invalid email address";
    if (!role) return  "The user role is required";
    if (!validator.isStrongPassword(password,{ //ejemplo de contraseña:AdminUser!2
        minLength: 9,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })){
        return "The password must have at least 8 characters, one uppercase, one lowercase, one number, and one symbol."; 
    }
    return null
}