import { findStoreById } from "../models/storeModel.js";
import { createRating, findRatingById, updateRating } from "../models/ratingModel.js";

const ratingError = "Rating must be between 1 and 5";

function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export async function addRating(req, res) {
  const { storeId, rating } = req.body || {};

  if (!isValidRating(rating)) {
    return res.status(400).json({ message: ratingError });
  }

  try {
    const store = Number.isInteger(storeId) ? await findStoreById(storeId) : null;
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // user id always comes from the token
    const newRating = await createRating(req.user.id, storeId, rating);
    res.status(201).json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    // unique (user_id, store_id) stops a second rating for the same store
    if (err.code === "23505") {
      return res.status(409).json({ message: "You have already rated this store" });
    }
    console.error("Add rating error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

export async function modifyRating(req, res) {
  const id = Number(req.params.id);
  const { rating } = req.body || {};

  if (!isValidRating(rating)) {
    return res.status(400).json({ message: ratingError });
  }

  try {
    const existing = Number.isInteger(id) ? await findRatingById(id) : null;
    if (!existing) {
      return res.status(404).json({ message: "Rating not found" });
    }
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only modify your own rating" });
    }

    const updated = await updateRating(id, rating);
    res.json({ message: "Rating updated", rating: updated });
  } catch (err) {
    console.error("Modify rating error:", err.message);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
