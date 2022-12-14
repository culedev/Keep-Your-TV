const isLoggedIn = (req, res, next) => {
  if (req.session.user === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
  return;
};

const isAdmin = (req, res, next) => {
  if (req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/shows");
  }
};

const isUserBan = (req,res,next) => {
  if (req.session.user.isBanned === true) {
    res.redirect("/auth/banned")
  } else {
    next();
  }
}

const localsUpdate = (req, res, next) => {
  res.locals.session = req.session;
  if (req.session.user === undefined) {
    res.locals.isUserActive = false;
    res.locals.isUserAdmin = false;
  } else if (req.session.user.role === "admin") {
    res.locals.isUserActive = true;
    res.locals.isUserAdmin = true;
  } else if (req.session.user.role === "user") {
    res.locals.isUserActive = true;
    res.locals.isUserAdmin = false;
  }
  next();
};

module.exports = {
  isAdmin,
  isLoggedIn,
  localsUpdate,
  isUserBan,
};
