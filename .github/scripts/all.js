const { addDomain } = require("./addDomain.js");
const { removeDomain } = require("./removeDomain.js");

const message = process.env.MESSAGE;

if (message === "add") {
  addDomain();
} else {
  removeDomain;
}
