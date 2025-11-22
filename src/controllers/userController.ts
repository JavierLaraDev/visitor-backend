import type { Request, Response } from "express";
import prisma from "../models/prisma.js";
import { hashPassword } from "../services/password.service.js";
import { generateToken } from "../services/auth.service.js";
export const createUser = async (req: Request, res: Response) => {
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
};
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true
            }
        });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};