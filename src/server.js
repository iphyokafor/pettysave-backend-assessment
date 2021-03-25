const { config } = require("dotenv");
const http = require("http");
const app = require("./app");

config();

const PORT = process.env.NODE_ENV === "test" ? 6378 : process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
