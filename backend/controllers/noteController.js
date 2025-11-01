// backend/controllers/noteController.js
const {
  createNote,
  listNotes,
  deleteNote,
} = require("../services/noteService");

const createNoteHandler = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "content required" });
    }
    const note = await createNote({ userId, content });
    res.json({ success: true, note });
  } catch (err) {
    console.error("Note create error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listNotesHandler = async (req, res) => {
  try {
    const { userId } = req.query;
    const notes = await listNotes({ userId });
    res.json({ success: true, notes });
  } catch (err) {
    console.error("Note list error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNoteHandler = async (req, res) => {
  try {
    const { id } = req.params; // URL se id le raha hai
    const userId = req.query.userId || req.query.user; // query se userId le raha hai

    if (!id) {
      return res.status(400).json({ error: "note id required" });
    }

    const note = await deleteNote({ id, userId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.json({
      success: true,
      message: "Note deleted successfully",
      note,
    });
  } catch (err) {
    console.error("Note delete error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createNoteHandler, listNotesHandler, deleteNoteHandler };
