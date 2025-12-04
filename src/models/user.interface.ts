import { Role, Status } from "@prisma/client";

export interface User {
    id: number;
    email: string;
    password: string;
    role: Role;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    secondLastName?: string | null;
    major: string;
    status: Status;
}
