// backend/routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const {
  createNoteHandler,
  listNotesHandler,
  deleteNoteHandler,
} = require("../controllers/noteController");

router.post("/", createNoteHandler); // POST /api/notes
router.get("/", listNotesHandler); // GET  /api/notes?userId=123
router.delete("/:id", deleteNoteHandler);

module.exports = router;
