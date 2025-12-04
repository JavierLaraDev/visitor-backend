import type { AttentionStatus, VisitorType } from "@prisma/client";

export interface Visitor {
    id: number;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    secondLastName?: string | null;
    phone: string;
    visitorType: VisitorType;
    major?: string | null;
    reason: string;
    status: AttentionStatus;
    registeredById: number;
    createdAt: Date;
}