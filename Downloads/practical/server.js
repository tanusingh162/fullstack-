const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request received at: ${new Date().toISOString()}`);
  console.log(`${req.method} ${req.url}`);
  next();
});

let users = [];
let idCounter = 1;

const createResponse = (message, data = null) => ({
  message,
  time: new Date().toISOString(),
  ...(data && { data }),
});

app.get("/", (req, res) => {
  res.json(createResponse("Server Running"));
});

app.get("/users", (req, res) => {
  res.json(createResponse("Users fetched successfully", users));
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);

  if (!user) {
    return res.status(404).json(createResponse("User not found"));
  }

  res.json(createResponse("User fetched successfully", user));
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json(createResponse("Name and email are required"));
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json(createResponse("Email already exists"));
  }

  const newUser = {
    id: idCounter++,
    name,
    email,
  };

  users.push(newUser);

  res.status(201).json(createResponse("User added successfully", newUser));
});

app.delete("/users/:id", (req, res) => {
  const index = users.findIndex((u) => u.id == req.params.id);

  if (index === -1) {
    return res.status(404).json(createResponse("User not found"));
  }

  users.splice(index, 1);

  res.json(createResponse("User deleted successfully"));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(createResponse("All fields required"));
  }

  if (email === "admin@gmail.com" && password === "1234") {
    return res.json(createResponse("Login Success"));
  }

  res.status(401).json(createResponse("Invalid Credentials"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
