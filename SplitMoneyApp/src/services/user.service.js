const { v4: uuidv4 } = require("uuid");
const pool = require("../db/postgres");
const User = require("../models/User"); // 👈 IMPORTANT

class UserService {
  async createUser(name, email) {
    const id = uuidv4();

    const query = `
      INSERT INTO users (id, name, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [id, name, email]);
    const user = result.rows[0];

    return new User(user.id, user.name, user.email);
  }
}

module.exports = new UserService();
