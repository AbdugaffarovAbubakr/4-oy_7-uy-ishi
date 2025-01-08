const express = require("express");
const { createBlog } = require("../controllers/blogs");
const router = express.Router();

router.post("/", createBlog);

module.exports = router;
