const jsonServer = require("json-server");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files

// Define the image upload endpoint
server.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded." });
  }

  // Read the uploaded image
  const imagePath = req.file.path;
  const imageName = req.file.originalname;

  // Store image info in your database (db.json)
  const imageInfo = {
    id: Date.now(), // You can generate a unique ID using any method you prefer
    imageUrl: imagePath,
    imageName: imageName,
  };
  
  // Update your database (db.json) with the new image info
  const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
  db.images.push(imageInfo);
  fs.writeFileSync("db.json", JSON.stringify(db));

  res.status(200).json({ message: "Image uploaded successfully.", image: imageInfo });
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
