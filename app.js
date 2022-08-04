// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper("isSelected", (value, currentStatus) => {
  return value === currentStatus;
});

hbs.registerHelper("starsSelected", (value, currentStatus) => {
  return value === currentStatus;
});

hbs.registerHelper("isUser", (userId, userSession, isAdmin) => {
  if (userId === userSession || isAdmin) {
    return true;
  } else {
    return false;
  }
})

hbs.registerHelper("getCarImg", (arr, index, pos) => {
  let realIndex;
  let newIndex = index;

  if (index >= 5) {
    newIndex = index - 5;
  }

  if (index >= 10) {
    newIndex = index - 10;
  }

  if (index >= 15) {
    newIndex = index - 15;
  }
  if (index >= 20) {
    newIndex = index - 20;
  }

  if (newIndex % 8 === 0) {
    realIndex = Number(newIndex) + Number(pos);
  } else if (newIndex % 8 !== 0) {
    realIndex = 4 * Number(newIndex) + Number(pos);
  }

  return `https://image.tmdb.org/t/p/original/${arr[realIndex]?.poster_path}`;
});

hbs.registerHelper("getCarId", (arr, index, pos) => {
  let realIndex;
  let newIndex = index;

  if (index >= 5) {
    newIndex = index - 5;
  }

  if (index >= 10) {
    newIndex = index - 10;
  }

  if (index >= 15) {
    newIndex = index - 15;
  }
  if (index >= 20) {
    newIndex = index - 20;
  }

  if (newIndex % 8 === 0 && newIndex <= 8) {
    realIndex = Number(newIndex) + Number(pos);
  } else if (newIndex % 8 !== 0 && newIndex <= 8) {
    realIndex = 4 * Number(newIndex) + Number(pos);
  }
  return `/shows/${arr[realIndex]?.id}/details`;
});

hbs.registerHelper("emojis", (str) => {
  newStr = str.replace(/^\<p\>/,"").replace(/\<\/p\>$/,"");
  return newStr;
})

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "Keep Your TV";

app.locals.appTitle = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
