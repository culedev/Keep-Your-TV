const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// GET "/auth/signup"
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup"
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  // GC => user doesnt fill the fields
  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      error: "Fill all the fields",
    });
    return;
  }

  // GC => password must have different characters
  const passRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
  if (passRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      error:
        "Password must contain at least 8 characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character",
    });
    return;
  }

  //TODO USERNAME GC

  try {
    // User validation
    const foundEmail = await User.findOne({ email });
    if (foundEmail !== null) {
      res.render("auth/signup.hbs", {
        error: "Email already in use",
      });
      return;
    }

    const foundUser = await User.findOne({ username });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        error: "Username already in use",
      });
      return;
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, email, password: hashedPassword });

    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

// GET "/auth/login"
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});


//POST "/auth/login"
router.post("/login", async (req, res, next) => {
  const { access, password } = req.body;

  // GC => validations
  if (access === "" || password === "") {
    res.render("auth/login.hbs", {
      error: "Fill all the fields",
    });
    return;
  }

  try {
    
    const foundUser = await User.findOne({$or: [{ username: access }, { email: access }]})
    
    if(foundUser === null) {
        res.render("auth/login.hbs", {
            error: "User not found"
        })
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)

    if(isPasswordValid === false) {
        res.render("auth/login.hbs", {
            error: "Invalid password"
        })
        return;
    }

    req.session.user = {
        _id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role,
        username: foundUser.username,
        image: foundUser.image,
        isBanned: foundUser.isBanned,
        friends:[],
      };

      req.session.save(() => {
        res.redirect("/shows")
      })
    
  } catch (err) {
    next(err)
  }
});

// GET LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/auth/login")
  })
})

// GET "/auth/banned"
router.get("/banned", (req, res, next) => {
  res.render("auth/banned.hbs")
})

module.exports = router;
