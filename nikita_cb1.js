"use strict";

const express = require("express");
const path = require("node:path");

const app = express();

let books = [
  { id: 1, title: "JavaScript для начинающих", author: "A. Author" },
  { id: 2, title: "Node.js на практике", author: "B. Author" },
  { id: 3, title: "Веб-разработка", author: "C. Author" }
];
let nextId = 4;

// Готовая инфраструктура: JSON-body и статический браузерный клиент.
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// TODO 1. Middleware-логгер
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// TODO 2. GET /api/books
app.get("/api/books", (req, res) => {
  const { q } = req.query;
  if (q) {
    const needle = q.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(needle) ||
        book.author.toLowerCase().includes(needle)
    );
    return res.json(filtered);
  }
  res.json(books);
});

// TODO 3. GET /api/books/:id
app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

// TODO 4. POST /api/books
app.post("/api/books", (req, res) => {
  const { title, author } = req.body || {};
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  const book = { id: nextId++, title, author };
  books.push(book);
  res.status(201).json(book);
});

// TODO 5. PATCH /api/books/:id
app.patch("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const { title, author } = req.body || {};
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  res.json(book);
});

// TODO 6. DELETE /api/books/:id
app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }
  books.splice(index, 1);
  res.status(204).end();
});

module.exports = app;