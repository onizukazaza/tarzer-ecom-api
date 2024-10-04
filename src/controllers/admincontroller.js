const User = require("../models/user");


exports.updateRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
  
    try {
      if (!["buyer", "seller", "admin"].includes(role)) {
        return res.statu(400).json({ message: "Invalid role" });
      }
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.role = role;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error("Error during updating role:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  