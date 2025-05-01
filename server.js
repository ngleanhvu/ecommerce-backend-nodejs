const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV listen on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Express Server"));
});
