const crypto = require("crypto");

const key1 = crypto.randomBytes(32).toString("hex"); // JWT_KEY
const key2 = crypto.randomBytes(32).toString("hex"); // REFRESH_TOKEN

console.table({ key1, key2 });
