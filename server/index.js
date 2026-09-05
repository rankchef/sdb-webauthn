import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.js';
import registerRouter from './routes/register.js';
import loginRouter from './routes/login.js';
import sessionRouter from './routes/session.js';
import notesRouter from './routes/notes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, 'public');
const apiPrefixes = ['/health', '/register', '/login', '/notes', '/me', '/logout'];

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

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (apiPrefixes.some((prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`))) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server started running on ${PORT}`);
});
