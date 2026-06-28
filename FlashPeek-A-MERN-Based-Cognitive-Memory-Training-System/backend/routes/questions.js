import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

/* ----------------------------------------------------
   GET /api/questions  (all or filter by deck)
---------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const { deck } = req.query;

    let filter = {};
    if (deck) filter.deck = deck;

    const items = await Question.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/* ----------------------------------------------------
   GET /api/questions/decks
---------------------------------------------------- */
router.get("/decks", async (req, res) => {
  try {
    const decks = await Question.distinct("deck");
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch decks" });
  }
});

/* ----------------------------------------------------
   POST /api/questions  (create flashcard)
---------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const newCard = new Question(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ----------------------------------------------------
   DELETE /api/questions/:id
---------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
