import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: process.env.DB_INSTANCE
    },
    port: +process.env.DB_PORT,
};

export const connectToDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log("✅ Connected to MSSQL");

        return pool;
    } catch (err) {
        console.error("❌ Connection failed:", err);
    }
};