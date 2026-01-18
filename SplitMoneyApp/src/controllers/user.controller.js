const userService = require("../services/user.service");

class UserController {
  async createUser(req, res) {
    try {
      const { name, email } = req.body;
      const user = await userService.createUser(name, email);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
