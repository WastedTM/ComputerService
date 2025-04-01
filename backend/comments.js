import sql from "mssql";

export const createComment = (db) => async (req, res) => {
    const { id: request_id } = req.params;
    console.log(request_id)
    const { tech_id, message } = req.body;

    if (!tech_id || !message) {
        return res.status(400).json({ message: 'tech_id and message are required' });
    }

    try {
        await db.request()
            .input('request_id', sql.Int, request_id)
            .input('tech_id', sql.Int, tech_id)
            .input('message', sql.Text, message)
            .query(`
                INSERT INTO Request_comments (request_id, tech_id, message, created_at, updated_at)
                VALUES (@request_id, @tech_id, @message, GETDATE(), GETDATE())
            `);

        res.status(201).json({ message: 'Comment created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create comment' });
    }
}

export const getComments = (db) => async (req, res) => {
try {
        const request_id = req.params.id;
        const request = `
            SELECT 
    rc.id, 
    rc.request_id, 
    rc.tech_id, 
    rc.message, 
    rc.created_at, 
    rc.updated_at,
    t.name AS technician_name,
    t.email AS technician_email
FROM Request_comments rc
LEFT JOIN Users t ON rc.tech_id = t.id
WHERE rc.request_id = @request_id
        `;

        const result = await db.request()
            .input('request_id', sql.Int, request_id)
            .query(request);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({ message: 'Error fetching user requests' });
    }
}