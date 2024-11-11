const noteRepository = require("../repositories/notesRepository");

addNewNote = async (req, res) => {
  try {
    const { title, body, archived } = req.body;

    await noteRepository.createNote({
      title,
      body,
      archived,
    });

    return res
      .status(201)
      .json({ status: 201, message: "Note added successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

const getAllNote = async (req, res) => {
  try {
    const result = await noteRepository.getAllNote();
    res.status(200).json({ status: 200, data: result });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, archived } = req.body;

    const existingNote = await noteRepository.findNoteById(parseInt(id));
    if (!existingNote) {
      return res
        .status(404)
        .json({ status: 404, message: "Note not found" });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (body !== undefined) updates.body = body;
    if (archived !== undefined) updates.archived = archived;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No fields to update" });
    }

    await noteRepository.updateNote(parseInt(id), updates);

    return res
      .status(200)
      .json({ status: 200, message: "Note updated successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const existingNote = await noteRepository.findNoteById(parseInt(id));
    if (!existingNote)
      return res
        .status(404)
        .json({ status: 404, message: "Note not found" });

    await noteRepository.deleteNoteById(parseInt(id));

    return res
      .status(200)
      .json({ status: 200, message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
};

module.exports = {
  addNewNote,
  getAllNote,
  updateNote,
  deleteNote,
};
