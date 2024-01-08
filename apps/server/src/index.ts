import "colors";

import connectDB from "./configs/mongo";

import { app } from "./app";
import { PORT } from "./constants/env";
import { connectRedis } from "./configs/redis";

// cleaning log on save
console.clear();

const main = async () => {
  try {
    await connectDB();
    // TODO: fix redis issue
    // await connectRedis();
    app.listen(PORT, () => {
      console.log(`NodeJS: Server listening on ${PORT}.`.green);
    });
  } catch (error) {
    console.log("NodeJS: Failed to initialize app.".red);
    console.log(error);
  }
};

main();
