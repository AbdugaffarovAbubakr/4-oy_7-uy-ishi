const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const blogRoutes = require("./routes/blogs");

const app = express();

app.use(bodyParser.json());
app.use('/', userRoutes);
app.use("/blogs", blogRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
