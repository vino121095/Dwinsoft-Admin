const express = require("express");
const cors = require("cors");
const db = require("./Config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/auth");
const UserRoutes = require("./Routes/user");
const blogRoutes = require("./Routes/blog");
const categoryRoutes = require("./Routes/category");
const apiDocsRoutes = require("./Routes/api");

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3001", "https://dwinsoftadmin.boonnet.co"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);
app.use(cookieParser());

// Use body-parser without explicit limit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database sync
(async () => {
  await db.sync();
  console.log("Table created successfully");
})();

// Routes
app.use("/api", authRoutes);
app.use("/api", UserRoutes);
app.use("/api", blogRoutes);
app.use("/api", categoryRoutes);
app.use("/api", apiDocsRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
