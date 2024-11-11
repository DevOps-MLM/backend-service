const express = require("express");
const router = express.Router();
const noteController = require("../controllers/notesController");

router.get("/", noteController.getAllNote);
router.post("/", noteController.addNewNote);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
