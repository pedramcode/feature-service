import dotenv from "dotenv";

dotenv.config();

interface Config {
    HTTP_PORT: number;
    HTTP_HOST: string;
    LOG_PATH: string;
    RUNTIME: "dev" | "prod";
    REDIS_URL: string;
}

const config: Config = {
    HTTP_PORT: parseInt(process.env.HTTP_PORT || "3000", 10),
    HTTP_HOST: process.env.HTTP_HOST || "localhost",
    LOG_PATH: process.env.LOG_PATH || "/var/log",
    RUNTIME: process.env.RUNTIME == "prod" ? "prod" : "dev",
    REDIS_URL: process.env.REDIS_URL || "",
};

export default config;
