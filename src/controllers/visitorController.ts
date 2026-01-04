import type { Request, Response } from "express";
import prisma from "../models/prisma.js";

export const createVisitor = async (req: Request & { user?: any }, res: Response) => {
    const { firstName, middleName, lastName, secondLastName, phone, visitorType, major, reason } = req.body;

    if (!firstName) return res.status(400).json({ error: "First name is required" });
    if (!lastName) return res.status(400).json({ error: "Last name is required" });
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    if (!visitorType) return res.status(400).json({ error: "Visitor type is required" });
    if (!reason) return res.status(400).json({ error: "Reason is required" });

    const registeredById = req.user.id;

    try {
        const newVisitor = await prisma.visitor.create({
            data: {
                firstName,
                middleName,
                lastName,
                secondLastName,
                phone,
                visitorType,
                major,
                reason,
                registeredById
            }
        });

        return res.status(201).json(newVisitor);

    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "A visitor with the same phone already exists" });
        }

        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};
export const getVisitors = async (_req: Request, res: Response) => {
    try {
        const visitors = await prisma.visitor.findMany();
        return res.status(200).json(visitors);

    } catch (_) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};

export const getVisitor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const visitorId = Number(id);

    if (isNaN(visitorId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const visitor = await prisma.visitor.findUnique({
            where: { id: visitorId }
        });

        if (!visitor) {
            return res.status(404).json({ error: "Visitor not found" });
        }

        return res.status(200).json(visitor);

    } catch (_) {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};
export const updateVisitor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const visitorId = Number(id);

    if (isNaN(visitorId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    const { firstName, middleName, lastName, secondLastName, phone, visitorType, major, reason } = req.body;

    try {
        const updatedVisitor = await prisma.visitor.update({
            where: { id: visitorId },
            data: {
                firstName,
                middleName,
                lastName,
                secondLastName,
                phone,
                visitorType,
                major,
                reason
            }
        });

        return res.status(200).json(updatedVisitor);

    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Visitor not found" });
        }

        if (error.code === "P2002") {
            return res.status(400).json({ error: "A visitor with the same phone already exists" });
        }

        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};
export const deleteVisitor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const visitorId = Number(id);

    if (isNaN(visitorId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        await prisma.visitor.delete({
            where: { id: visitorId }
        });

        return res.status(200).json({ message: "Visitor deleted successfully" });

    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Visitor not found" });
        }

        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};
// ---------------------------------------------------------------
// UPDATE VISITOR STATUS (ONLY ADMIN)
// ---------------------------------------------------------------
export const updateVisitorStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const visitorId = Number(id);

    if (isNaN(visitorId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    const { status } = req.body;

    if (!status) return res.status(400).json({ error: "Status is required" });

    // validar que el estado sea válido
    if (!["PENDING", "ATTENDED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const updatedVisitor = await prisma.visitor.update({
            where: { id: visitorId },
            data: { status }
        });

        return res.status(200).json(updatedVisitor);

    } catch (error: any) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Visitor not found" });
        }

        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};
