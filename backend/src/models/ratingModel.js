import pool from "../config/db.js";

export async function createRatingsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (user_id, store_id)
    )
  `);
}

export async function findRatingById(id) {
  const result = await pool.query("SELECT * FROM ratings WHERE id = $1", [id]);
  return result.rows[0];
}

export async function createRating(userId, storeId, rating) {
  const result = await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     RETURNING id, store_id AS "storeId", rating`,
    [userId, storeId, rating]
  );
  return result.rows[0];
}

export async function updateRating(id, rating) {
  const result = await pool.query(
    `UPDATE ratings SET rating = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, store_id AS "storeId", rating`,
    [rating, id]
  );
  return result.rows[0];
}

const raterColumns = {
  userName: "u.name",
  userEmail: "u.email",
  rating: "r.rating",
  updatedAt: "r.updated_at",
};

// users who rated a store
export async function getStoreRatings(storeId, sortBy, order) {
  const column = raterColumns[sortBy] || raterColumns.userName;
  const direction = order === "desc" ? "DESC" : "ASC";

  const result = await pool.query(
    `SELECT r.id, u.name AS "userName", u.email AS "userEmail",
            r.rating, r.updated_at AS "updatedAt"
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY ${column} ${direction}, r.id`,
    [storeId]
  );
  return result.rows;
}
