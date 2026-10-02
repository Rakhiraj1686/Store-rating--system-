import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { createUser, createUsersTable, findByEmail } from "../models/userModel.js";
import { createStoresTable } from "../models/storeModel.js";

export async function seedDemoAccounts() {
  // Admin and store owner cannot sign up, so we add one of each here
  const accounts = [
    {
      name: "System Administrator Account",
      email: "admin@example.com",
      address: "Head Office",
      password: "Admin@123",
      role: "admin",
    },
    {
      name: "Demo Store Owner Account",
      email: "owner@example.com",
      address: "Main Market Road",
      password: "Owner@123",
      role: "store_owner",
    },
  ];

  await createUsersTable();
  await createStoresTable();

  for (const account of accounts) {
    if (await findByEmail(account.email)) {
      console.log(`${account.email} already exists`);
      continue;
    }
    const password = await bcrypt.hash(account.password, 10);
    await createUser({ ...account, password });
    console.log(`Created ${account.role}: ${account.email}`);
  }

  const stores = [
    ["ABC Store", "abc@example.com", "MP Nagar, Bhopal, Madhya Pradesh"],
    ["XYZ Mart", "xyz@example.com", "Vijay Nagar, Indore, Madhya Pradesh"],
    ["Fresh Basket", "fresh@example.com", "Civil Lines, Jabalpur, Madhya Pradesh"],
    ["City Electronics", "city@example.com", "New Market, Bhopal, Madhya Pradesh"],
    ["Book Corner", "books@example.com", "Palasia, Indore, Madhya Pradesh"],
  ];

  for (const [name, email, address] of stores) {
    await pool.query(
      "INSERT INTO stores (name, email, address) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING",
      [name, email, address]
    );
  }

  await pool.query(
    `UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'owner@example.com')
     WHERE email = 'abc@example.com' AND owner_id IS NULL
     AND NOT EXISTS (SELECT 1 FROM stores WHERE owner_id = (SELECT id FROM users WHERE email = 'owner@example.com'))`
  );

  console.log("Sample stores added");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await seedDemoAccounts();
  await pool.end();
}
