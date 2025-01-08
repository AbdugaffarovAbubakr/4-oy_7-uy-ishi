const fs = require("fs/promises");

const readData = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch (err) {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const writeData = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
