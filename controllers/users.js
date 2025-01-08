const { readData, writeData } = require("../utils/fileOperations");
const bcrypt = require("bcrypt");

const USERS_FILE = "./database/users.json";

const registerUser = async (req, res) => {
  const { username, password, fullName, age, email, gender } = req.body;
  try {
    let users = await readData(USERS_FILE);

    if (users.some((user) => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (
      !username ||
      username.length < 3 ||
      !password ||
      password.length < 5 ||
      !email ||
      !age ||
      age < 10
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      fullName: fullName || "",
      age,
      email,
      gender: gender || "",
    };

    users.push(newUser);
    await writeData(USERS_FILE, users);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  const { identifier } = req.params;
  try {
    const users = await readData(USERS_FILE);
    const user = users.find(
      (u) => u.username === identifier || u.email === identifier
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { identifier } = req.params;
  const { username, password, fullName, age, email, gender } = req.body;
  try {
    let users = await readData(USERS_FILE);
    const userIndex = users.findIndex(
      (u) => u.username === identifier || u.email === identifier
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      username &&
      users.some(
        (user) => user.username === username && user.id !== users[userIndex].id
      )
    ) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (
      email &&
      users.some(
        (user) => user.email === email && user.id !== users[userIndex].id
      )
    ) {
      return res.status(400).json({ message: "Email already registered" });
    }

    users[userIndex] = {
      ...users[userIndex],
      username,
      password: password
        ? await bcrypt.hash(password, 10)
        : users[userIndex].password,
      fullName,
      age,
      email,
      gender,
    };
    await writeData(USERS_FILE, users);
    res.json({
      message: "Profile updated successfully",
      user: users[userIndex],
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProfile = async (req, res) => {
  const { identifier } = req.params;
  try {
    let users = await readData(USERS_FILE);
    const userIndex = users.findIndex(
      (u) => u.username === identifier || u.email === identifier
    );

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1);
    await writeData(USERS_FILE, users);
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, getProfile, updateProfile, deleteProfile };
