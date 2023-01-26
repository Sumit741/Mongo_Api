const User = require("../model/User");

const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: "User or password missing" }).exec();
  }

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) {
    return res.sendStatus(409);
  } else {
    try {
      const hashedPwd = await bcrypt.hash(password, 10);
      const result = await User.create({
        username: user,
        password: hashedPwd,
      });
      console.log(result);

      return res.status(201).json({ success: `New user ${user} created` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  handleNewUser,
};
