import type { Request, Response } from "express";
import prisma from "../models/prisma.js";

export const createVisitor = async (req:Request & {user?:any}, res:Response) => {
    const {firstName, middleName, lastName, secondLastName, phone, visitorType, major, reason} = req.body;
    if (!firstName) return res.status(400).json({ error: "First name is required" });
    if (!lastName) return res.status(400).json({ error: "Last name is required" });
    if (!phone) return res.status(400).json({ error: "Phone is required" });
    if (!visitorType) return res.status(400).json({ error: "Visitor type is required" });
    if (!reason) return res.status(400).json({ error: "Reason is required" });
        //  ID del PASANTE que registra el visitante
        const registeredById = req.user.id; // Asumiendo que el ID del usuario está disponible en req.userId
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
                registeredById // tomado del token
                // status NO se envía → queda por defecto como PENDING
            }
        })
        return res.status(201).json(newVisitor);
    } catch (error:any) {
        if(error?.code ==="P2002"){
            return res.status(400).json({error:"Visitor with the same phone already exists"});
        }
        return res.status(500).json({error:"An unexpected error occurred"});
    }
}