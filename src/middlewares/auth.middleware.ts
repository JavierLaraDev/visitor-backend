import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;// ✅ usar la cookie
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    jwt.verify(token, JWT_SECRET, (err: Error | null, decoded: any) => {
        if (err) return res.status(403).json({ error: "You do not have access to this resource" });
        (req as any).user = decoded;
        next();
    });
};
// (...allowedRoles: string[]) =>Significa que la función verifyRole puede recibir uno o varios roles como argumentos, y todos ellos se agrupan automáticamente en un arreglo llamado allowedRoles.

export const verifyRole = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ error: "Access denied: insufficient permissions" });
    next();
};