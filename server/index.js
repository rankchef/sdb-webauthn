import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRouter from './routes/health.js';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import sessionRouter from './routes/session.js';
import notesRouter from './routes/notes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.EXPECTED_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/health', healthRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/notes', notesRouter);
app.use(sessionRouter);

app.listen(PORT, () => {
  console.log(`Server started running on ${PORT}`);
});
