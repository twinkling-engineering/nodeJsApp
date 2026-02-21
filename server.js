const express = require("express");
const os = require("os");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Load version info
let versionInfo = {};
try {
  versionInfo = JSON.parse(fs.readFileSync("./version.json", "utf8"));
} catch {
  versionInfo = { version: "unknown" };
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Deployment Test App Running 🚀",
    version: versionInfo.version,
    buildTime: versionInfo.buildTime,
    environment: process.env.NODE_ENV || "development"
  });
});

// Health endpoint (important for Kubernetes)
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    timestamp: new Date(),
  });
});

// Deployment info endpoint
app.get("/deployment-info", (req, res) => {
  res.json({
    version: versionInfo.version,
    buildTime: versionInfo.buildTime,
    environment: versionInfo.environment,
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: process.uptime()
  });
});

// Crash endpoint (to test failure tracking)
app.get("/crash", (req, res) => {
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
