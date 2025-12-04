import type { Request, Response } from "express";
import prisma from "../models/prisma.js";
import { hashPassword } from "../services/password.service.js";
import { generateToken } from "../services/auth.service.js";


// -------------------------------------------------------------------
// CREATE USER
// -------------------------------------------------------------------
export const createUser = async (req: Request, res: Response) => {
    const { email, password, role, firstName, middleName, lastName, secondLastName, major, status } = req.body;

    // Validaciones
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    if (!role) return res.status(400).json({ error: "Role is required" });
    if (!firstName) return res.status(400).json({ error: "First name is required" });
    if (!lastName) return res.status(400).json({ error: "Last name is required" });
    if (!major) return res.status(400).json({ error: "Major is required" });
    if (password.length < 9) return res.status(400).json({ error: "Password must be at least 9 characters long" });

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                firstName,
                middleName,
                lastName,
                secondLastName,
                major,
                status
            }
        });

        const token = generateToken(user);
        res.status(201).json({ token });

    } catch (error: any) {
        if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "An unexpected error occurred" });
    }
};


// -------------------------------------------------------------------
// GET ALL USERS
// -------------------------------------------------------------------
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                middleName: true,
                lastName: true,
                secondLastName: true,
                major: true,
                status: true
            }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
};


// -------------------------------------------------------------------
// GET SINGLE USER
// -------------------------------------------------------------------
export const getUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
};


// -------------------------------------------------------------------
// UPDATE USER
// -------------------------------------------------------------------
export const updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, role, firstName, middleName, lastName, secondLastName, major, status } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                email,
                role,
                firstName,
                middleName,
                lastName,
                secondLastName,
                major,
                status
            }
        });

        res.status(200).json(user);

    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "User not found" });
        }

        if (error.code === "P2002" && error?.meta?.target?.includes("email")) {
            return res.status(400).json({ error: "Email already exists" });
        }

        res.status(500).json({ error: "An unexpected error occurred" });
    }
};


// -------------------------------------------------------------------
// DELETE USER
// -------------------------------------------------------------------
export const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        const user = await prisma.user.delete({
            where: { id }
        });

        res.status(200).json(user);

    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(500).json({ error: "An unexpected error occurred" });
    }
};
