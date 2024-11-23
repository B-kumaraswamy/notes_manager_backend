const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// CREATE a new note
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const note = new Note({
      title,
      description,
      category,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// READ all notes (with optional filters for title and category)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query; // Extract the search query from the request

    let query = {}; // Initialize an empty query object

    if (search) {
      // If there is a search term, add a filter for title or category
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search for title
          { category: { $regex: search, $options: "i" } }, // Case-insensitive search for category
        ],
      };
    }

    const notes = await Note.find(query).sort({ created_at: -1 }); // Fetch notes and sort by creation date
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// UPDATE a note by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    note.title = title;
    note.description = description;
    note.category = category || note.category;
    note.updated_at = Date.now();

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// DELETE a note by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    console.log("Delete Request ID:", id); // Debug log

    // Find the note by ID
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" }); // Return 404 if the note doesn't exist
    }

    // Delete the note from the database
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;