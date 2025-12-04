import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import visitorRoutes from './routes/visitorRoutes.js';
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
app.use('/users',userRoutes);
app.use('/visitors', visitorRoutes)

export default app;