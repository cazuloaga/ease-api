import mongoose from "mongoose";
import config from "config";
import log from "./logger";

export default async function connect() {
  const dbUri = config.get<string>("dbUri");
  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info("Connected to  DB");
    })
    .catch((error) => {
      log.error("Could not connect to DB");
      log.error(error);
      process.exit(1);
    });
}
