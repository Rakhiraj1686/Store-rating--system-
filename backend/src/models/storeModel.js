import pool from "../config/db.js";

export async function createStoresTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      address VARCHAR(400) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function findStoreById(id) {
  const result = await pool.query("SELECT id FROM stores WHERE id = $1", [id]);
  return result.rows[0];
}

// only these columns can be used for sorting
const sortColumns = {
  name: "s.name",
  address: "s.address",
  overallRating: '"overallRating"',
  userRating: "mine.rating",
};

// all stores with the average rating and the rating of the logged-in user
export async function getStores(userId, search, sortBy, order) {
  const column = sortColumns[sortBy] || sortColumns.name;
  const direction = order === "desc" ? "DESC" : "ASC";

  // so that % and _ typed by the user are searched as normal characters
  const text = search.replace(/[\\%_]/g, "\\$&");

  const result = await pool.query(
    `SELECT s.id, s.name, s.email, s.address,
            (SELECT ROUND(AVG(rating), 2)::float FROM ratings WHERE store_id = s.id) AS "overallRating",
            mine.id AS "ratingId",
            mine.rating AS "userRating"
     FROM stores s
     LEFT JOIN ratings mine ON mine.store_id = s.id AND mine.user_id = $1
     WHERE s.name ILIKE $2 OR s.address ILIKE $2
     ORDER BY ${column} ${direction} NULLS LAST, s.name`,
    [userId, `%${text}%`]
  );
  return result.rows;
}
