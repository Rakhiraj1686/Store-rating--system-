import { getStores } from "../models/storeModel.js";

export async function listStores(req, res) {
  const search = (req.query.search || "").toString().trim();
  const sortBy = (req.query.sortBy || "").toString();
  const order = (req.query.order || "").toString();

  try {
    const stores = await getStores(req.user.id, search, sortBy, order);
    res.json({ stores });
  } catch (err) {
    console.error("List stores error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
