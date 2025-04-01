import sql from "mssql";
import bcrypt from "bcryptjs";
import { decodeToken } from "./utils.js";
import jwt from "jsonwebtoken";


export const getUserByToken = (db) => async (req, res) => {
    try{
        const user = await decodeToken(db)(req, res);
        
        const userId = user.id;

        const result = await db.request()
            .input('id', sql.Int, userId)
            .query('SELECT id, name, email, role FROM Users WHERE id = @id');


        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch(error){
        console.log(error);
    }
}

export const login = (db) => async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await db
            .request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Incorrect user data" });
        }

        const user = result.recordset[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect user data" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await db
            .request()
            .input("user_id", sql.Int, user.id)
            .input("token", sql.VarChar, token)
            .input("expires_at", sql.DateTime, expiresAt)
            .query(`
                INSERT INTO User_tokens (user_id, token, expires_at) 
                VALUES (@user_id, @token, @expires_at)
            `);

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (db) => async (req, res) => {
    const user = await decodeToken(db)(req, res);
    const token = req.headers.authorization.split(' ')[1];
    
    try {
        await db
            .request()
            .input("user_id", sql.Int, user.id)
            .input("token", sql.VarChar, token)
            .query(`
                DELETE FROM User_tokens 
                WHERE user_id = @user_id AND token = @token
            `);

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};