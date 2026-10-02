import bcrypt from "bcryptjs";
import pool from "./config/db.js";
import { createUser, createUsersTable, findByEmail } from "./models/userModel.js";

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

for (const account of accounts) {
  if (await findByEmail(account.email)) {
    console.log(`${account.email} already exists`);
    continue;
  }
  const password = await bcrypt.hash(account.password, 10);
  await createUser({ ...account, password });
  console.log(`Created ${account.role}: ${account.email}`);
}

await pool.end();
