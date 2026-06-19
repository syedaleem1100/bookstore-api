const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// @route   GET /api/books
// @desc    Get all books (supports search by author/genre and pagination)
// @query   author, genre, page, limit
router.get("/", async (req, res, next) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    // Build a dynamic filter object based on whichever query params are present
    const filter = {};
    if (author) filter.author = { $regex: author, $options: "i" };
    if (genre) filter.genre = { $regex: genre, $options: "i" };

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.max(parseInt(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      total: totalBooks,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalBooks / limitNumber),
      data: books,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/books
// @desc    Add a new book
router.post("/", async (req, res, next) => {
  try {
    const { title, author, price } = req.body;

    // Manual check in addition to schema-level validation, so we
    // can return a clean 400 before even hitting the database
    if (!title || !author || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "Title, author and price are required fields",
      });
    }

    const newBook = await Book.create(req.body);
    res.status(201).json({ success: true, data: newBook });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/books/:id
// @desc    Update an existing book by ID
router.put("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // re-run schema validation on update
    });

    res.status(200).json({ success: true, data: updatedBook });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
