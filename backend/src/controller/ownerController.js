import { findStoreByOwner } from "../models/storeModel.js";
import { getStoreRatings } from "../models/ratingModel.js";

export async function getMyStore(req, res) {
  const sortBy = (req.query.sortBy || "").toString();
  const order = (req.query.order || "").toString();

  try {
    // owner id comes from the token, so an owner only sees their own store
    const store = await findStoreByOwner(req.user.id);
    if (!store) {
      return res.json({ store: null, ratings: [] });
    }

    const ratings = await getStoreRatings(store.id, sortBy, order);
    res.json({ store, ratings });
  } catch (err) {
    console.error("Owner store error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
