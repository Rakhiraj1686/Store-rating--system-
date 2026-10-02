import pool from "../config/db.js";

export async function createUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(400),
      role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('admin', 'user', 'store_owner')),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

export async function createUser({ name, email, address, password, role }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, address, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role`,
    [name, email, address, password, role]
  );
  return result.rows[0];
}

export async function findById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updatePassword(id, password) {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [password, id]);
}
