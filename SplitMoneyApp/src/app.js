const express = require("express");
require("dotenv").config();
const pool = require("./db/postgres");
const routes = require("./routes");

const app = express();
app.use(express.json());

pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error(err));

app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
