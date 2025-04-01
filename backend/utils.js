import sql from "mssql";
import jwt from "jsonwebtoken";

export const decodeToken = (db) => async (req, res) => {
    const header = req.headers.authorization;
    
    if (!header) {
        return res.status(401).json({ message: 'Header missing' });
    }
    
    try {
        const token = header.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                await db.request()
                    .input('token', sql.VarChar, token)
                    .query('DELETE FROM user_tokens WHERE token = @token');
                return res.status(401).json({ message: 'Token expired and removed' });
            }
            console.log(error)
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}