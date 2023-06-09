const mongoose = require("mongoose");
const dotenv = require(`dotenv`);

process.on("uncaughtException", (err) => {
  console.log(`=== UNCAUGHT EXEPTION === Shutting Downd Server ===`);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

// MongoDB Connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`===== DB Connected =====`);
  });

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`======= App runing on port ${port} =======`);
});

// Server Crush Logger ,
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("======= Shutting Down Server =======");
  server.close(() => {
    process.exit(1);
  });
});
