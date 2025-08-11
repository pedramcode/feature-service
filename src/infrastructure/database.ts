import { exit } from "process";
import { PrismaClient } from "../generated/prisma/client";
import logger from "./logger";

export const prisma = new PrismaClient();

prisma
    .$connect()
    .then(() => {
        logger.info("database is connected");
    })
    .catch((e) => {
        logger.error("unable to connect to database");
        exit(1);
    });
