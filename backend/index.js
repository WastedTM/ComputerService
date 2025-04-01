import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDB } from './conectToBD.js';
import { getUserByToken, login, logout } from "./auth.js";
import { getUserRequsts, getTechicianRequests, getCurrentRequest, updateRequest, createUserRequest } from "./request.js";
import { createComment, getComments } from "./comments.js"
 
const db = await connectToDB();
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post("/login", login(db));

app.post('/logout', logout(db));

app.get('/me', getUserByToken(db));

app.get('/requests/user/:id', getUserRequsts(db));

app.post('/request/user/:id', createUserRequest(db));

app.get('/requests/technician/:id', getTechicianRequests(db));

app.get('/request/:id', getCurrentRequest(db));

app.put('/request/:id', updateRequest(db));

app.post('/request/comments/:id', createComment(db));

app.get('/request/comments/:id', getComments(db));

process.on("SIGINT", async () => {
    if (db) {
        await db.close();
        console.log("❌ Disconnected from MSSQL");
    }
    process.exit(0);
});