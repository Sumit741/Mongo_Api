const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res
      .status(400)
      .json({ message: `Username and password is required` });
  }
  const userPresent = await User.findOne({ username: user }).exec();
  console.log(userPresent);
  if (!userPresent) {
    console.log("user not present");
    return res.sendStatus(401);
  } else {
    const match = await bcrypt.compare(password, userPresent.password);
    if (match) {
      const roles = Object.values(userPresent.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: userPresent.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
      );

      const refreshToken = jwt.sign(
        {
          username: userPresent.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      userPresent.refreshToken = refreshToken;
      const result = await userPresent.save();
      console.log(result);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      console.log("totally unauthorized");
      res.sendStatus(401);
    }
  }
};

module.exports = { handleLogin };
