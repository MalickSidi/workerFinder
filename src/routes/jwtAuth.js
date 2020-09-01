const router = require("express").Router();
const bcrypt = require("bcrypt");

const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");

router.post("/login", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE (user_email = $1) OR (user_name = $2)",
      [email, name]
    );
    if (!user.rows[0]) {
      res.status(401).json({ message: "User is not available" });
      return;
    }

    const match = await bcrypt.compare(password, user.rows[0].user_password)
    console.log(match)

    res.json(user.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email, password);

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length) {
      res.status(401).json({ message: "User alrady exist" });
      return;
    }
    // parameter: salt Rounds = 10;
    const salt = await bcrypt.genSalt(Number(process.env.saltRounds));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ message: "ok", token });
  } catch (err) {
    console.log(err.message);
    res.send();
  }
});

module.exports = router;
