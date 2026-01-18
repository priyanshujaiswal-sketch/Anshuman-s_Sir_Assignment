const { v4: uuidv4 } = require("uuid");
const pool = require("../db/postgres");
const Group = require("../models/Group");

class GroupService {

  async createGroup(name) {
    const id = uuidv4();

    const query = `
      INSERT INTO groups (id, name)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await pool.query(query, [id, name]);
    const group = result.rows[0];

    return new Group(group.id, group.name);
  }

  async addUserToGroup(groupId, userId) {
    const query = `
      INSERT INTO group_members (group_id, user_id)
      VALUES ($1, $2)
    `;

    await pool.query(query, [groupId, userId]);
    return { message: "User added to group" };
  }
}

module.exports = new GroupService();
