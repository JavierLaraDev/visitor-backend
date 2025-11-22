import type { Request, Response } from "express";
import { hashPassword } from "../services/password.service.js";
import prisma from "../models/prisma.js";
import { generateToken } from "../services/auth.service.js";
import { comparePassword } from "../services/password.service.js";


export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!email) return res.status(400).json({ error: "Email address is required" });
    if (!password) return res.status(400).json({ error: "The password is required" });
    if (!role) return res.status(400).json({ error: "The user role is required" });
    if (password.length < 9) return res.status(400).json({ error: "Password must be at least 9 characters" });

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const hashedPasword = await hashPassword(password);
        console.log(hashedPasword)
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPasword,
                role
            }
        })
        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (error: any) {
        if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
            return res.status(400).json({ error: "Email already in use" });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email address is required" });
    if (!password) return res.status(400).json({ error: "The password is required" });
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: "The username or password does not match" });

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "The username and password does not match" });

        const token = generateToken(user);
        // res.status(200).json({ token,  role: user.role, email: user.email });
        // guarda el token en una cookie segura
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });
        res.status(200).json({
            role: user.role,
            email: user.email,
            message: "Login successful",
        });

    } catch (error: any) {

        res.status(500).json({ error: 'Internal server error' });
    }
}
// 📌 LOGOUT
export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};


export const me = (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role,
    })
};