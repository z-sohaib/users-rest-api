const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../data/users.json");

const readUsers = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// @route   GET /users
// @desc    Get all users
router.get("/", (req, res) => {
  const users = readUsers();
  res.json(users);
});

// @route   GET /users/:id
// @desc    Get user by ID
router.get("/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// @route   POST /users
// @desc    Create a new user
router.post("/", (req, res) => {
  const users = readUsers();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

// @route   PUT /users/:id
// @desc    Update user by ID
router.put("/:id", (req, res) => {
  const users = readUsers();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  writeUsers(users);

  res.json(users[userIndex]);
});

// @route   DELETE /users/:id
// @desc    Delete user by ID
router.delete("/:id", (req, res) => {
  let users = readUsers();
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users = users.filter((u) => u.id !== parseInt(req.params.id));
  writeUsers(users);

  res.status(204).end();
});

module.exports = router;
