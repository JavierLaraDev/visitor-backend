import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir cookies desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,// permite enviar cookies
}));

//routes
app.use('/auth',authRoutes);
app.use('/api/users',userRoutes);
// /autentication
// /users


export default app;