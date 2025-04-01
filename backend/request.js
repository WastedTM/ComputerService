import { decodeToken } from "./utils.js";
import sql from "mssql";


export const getUserRequsts = (db) => async (req, res) => {
    try {
        const userId = req.params.id;
        const request = `
            SELECT * FROM User_requests
            WHERE client_id = @userId
            ORDER BY created_at DESC
        `;

        const result = await db.request()
            .input('userId', sql.Int, userId)
            .query(request);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Error fetching user requests' });
    }
}

export const createUserRequest = (db) => async (req, res) => {
    try {
        const { title, description, phone_number } = req.body;
        const user = await decodeToken(db)(req, res);
        

        const query = `
            INSERT INTO User_requests (client_id, title, description, phone_number, status, created_at, updated_at)
            VALUES (@client_id, @title, @description, @phone_number, @status, GETDATE(), GETDATE())
        `;

        await db.request()
            .input('client_id', sql.Int, user.id)
            .input('title', sql.Text, title)
            .input('description', sql.Text, description)
            .input('phone_number', sql.Text, phone_number)
            .input('status', sql.VarChar(20), "new")
            .query(query);

        res.status(201).json({ message: 'Заявку успішно створено' });
    } catch (error) {
        console.error('Помилка при створенні заявки:', error);
        res.status(500).json({ message: 'Помилка при створенні заявки' });
    }
} 

export const getTechicianRequests = (db) => async (req, res) => {
    try {
        const techId = req.params.id;
        const request = `
            SELECT * FROM User_requests
            WHERE technician_id = @technicianId
            ORDER BY created_at DESC
        `;

        const result = await db.request()
            .input('technicianID', sql.Int, techId)
            .query(request);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Error fetching user requests' });
    }
}

export const getCurrentRequest = (db) => async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = `
            SELECT 
    ur.id, 
    ur.client_id, 
    ur.technician_id, 
    ur.title, 
    ur.description, 
    ur.phone_number, 
    ur.status, 
    ur.created_at, 
    ur.updated_at,
    c.name AS client_name,
    c.email AS client_email
FROM User_requests ur
LEFT JOIN Users c ON ur.client_id = c.id
WHERE ur.id = @requestId;
`;

        const result = await db.request()
            .input('requestId', sql.Int, requestId)
            .query(request);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Error fetching user requests' });
    }
}

export const updateRequest = (db) => async (req, res) => {
    const { id } = req.params;
    const { technician_id, title, description, phone_number, status } = req.body;

    try {
        await db.request()
            .input('id', sql.Int, id)
            .input('title', sql.Text, title)
            .input('description', sql.Text, description)
            .input('phone_number', sql.Text, phone_number)
            .input('status', sql.VarChar(20), status)
            .query(`
                UPDATE User_requests SET
                    title = @title,
                    description = @description,
                    phone_number = @phone_number,
                    status = @status,
                    updated_at = GETDATE()
                WHERE id = @id
            `);

        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update request' });
    }
}