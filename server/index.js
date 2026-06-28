const express = require('express');
const cors    = require('cors');
const mysql   = require('mysql2/promise');

const app  = express();
app.use(cors());
app.use(express.json());

// ── Database pool ──────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: '',           // change if you have a password
  database: 'employee_directory',
  waitForConnections: true,
  connectionLimit: 10,
});

// ── Whitelisted sort columns ───────────────────────────────────────────────
const ALLOWED_SORT = ['name', 'hireDate', 'salary', 'empId'];

// ── GET /employees  (list + search + sort) ─────────────────────────────────
app.get('/employees', async (req, res) => {
  try {
    const { q, sortBy, order } = req.query;

    let sql    = 'SELECT * FROM employees';
    const params = [];

    // Server-side search across 3 columns
    if (q) {
      sql += ' WHERE name LIKE ? OR empId LIKE ? OR email LIKE ?';
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    // Server-side sort – column is whitelisted, direction is forced to ASC/DESC
    if (sortBy && ALLOWED_SORT.includes(sortBy)) {
      const dir = order === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sortBy} ${dir}`;
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch employees.' });
  }
});

// Helper to strip time from date
function toDateOnly(val) {
  if (!val) return val;
  return String(val).slice(0, 10); // takes "2026-06-14" from any format
}

// ── POST /employees ────────────────────────────────────────────────────────
app.post('/employees', async (req, res) => {
  try {
    const { empId, name, email, department, position, hireDate, salary, active } = req.body;
    const sql = `INSERT INTO employees (empId, name, email, department, position, hireDate, salary, active)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [
      empId, name, email, department, position, toDateOnly(hireDate), salary, active ? 1 : 0,
    ]);
    const [rows] = await pool.execute('SELECT * FROM employees WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    const msg = err.code === 'ER_DUP_ENTRY'
      ? 'Employee ID or email already exists.'
      : 'Failed to create employee.';
    res.status(400).json({ message: msg });
  }
});

// ── PUT /employees/:id ─────────────────────────────────────────────────────
app.put('/employees/:id', async (req, res) => {
  try {
    const { empId, name, email, department, position, hireDate, salary, active } = req.body;
    const sql = `UPDATE employees
                 SET empId=?, name=?, email=?, department=?, position=?, hireDate=?, salary=?, active=?
                 WHERE id=?`;
    await pool.execute(sql, [
      empId, name, email, department, position, toDateOnly(hireDate), salary, active ? 1 : 0, req.params.id,
    ]);
    const [rows] = await pool.execute('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update employee.' });
  }
});

// ── DELETE /employees/:id ──────────────────────────────────────────────────
app.delete('/employees/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete employee.' });
  }
});

app.listen(3001, () => console.log('✅  Express running on http://localhost:3001'));