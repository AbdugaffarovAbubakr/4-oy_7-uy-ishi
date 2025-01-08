const { readData, writeData } = require("../utils/fileOperations");

const BLOGS_FILE = "./database/blogs.json";

const createBlog = async (req, res) => {
  const { title, slug, content, tags } = req.body;
  try {
    let blogs = await readData(BLOGS_FILE);

    if (!title || !slug || !content || !Array.isArray(tags)) {
      return res.status(400).json({ message: "Invalid blog data" });
    }
    if (blogs.some((blog) => blog.slug === slug)) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const newBlog = {
      id: blogs.length + 1,
      title,
      slug,
      content,
      tags,
      comments: [],
    };

    blogs.push(newBlog);
    await writeData(BLOGS_FILE, blogs);
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createBlog };
