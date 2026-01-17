require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/notification.routes");
require("./config/db"); 
const notificationService = require("./services/notification.service");

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  console.log("🔄 Checking for pending notifications after crash...");
  await notificationService.recoverCrash();
});