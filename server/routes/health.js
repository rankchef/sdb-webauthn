import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const dbResult = await pool.query('SELECT NOW()');
  res.json({ status: `OK @ ${dbResult.rows[0].now}` });
});

export default router;
