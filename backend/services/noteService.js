// backend/services/noteService.js
const Note = require("../models/Note");

// async function createNote({ userId = "anonymous", content }) {
//   const note = new Note({ userId, content });
//   await note.save();
//   return note;
// }
async function createNote({ userId, content }) {
  if (!userId) {
    throw new Error("User ID missing while creating note");
  }

  const note = new Note({ userId, content });
  await note.save();
  return note;
}

async function listNotes({ userId } = {}) {
  // if userId provided filter; otherwise return recent notes
  const query = userId ? { userId } : {};
  return Note.find(query).sort({ createdAt: -1 }).limit(100).lean();
}
async function deleteNote({ id, userId }) {
  const note = await Note.findOneAndDelete({ _id: id, userId });
  return note;
}

module.exports = { createNote, listNotes, deleteNote };
