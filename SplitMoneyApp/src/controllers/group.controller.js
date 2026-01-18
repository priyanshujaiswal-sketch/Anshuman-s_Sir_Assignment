const groupService = require("../services/group.service");

class GroupController {

  async createGroup(req, res) {
    try {
      const { name } = req.body;
      const group = await groupService.createGroup(name);
      res.status(201).json(group);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async addUserToGroup(req, res) {
    try {
      const { groupId } = req.params;
      const { userId } = req.body;

      const result = await groupService.addUserToGroup(groupId, userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new GroupController();
