import "./styles.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RequestDetails = ({user}) => {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        fetchRequestDetails();
        fetchComments();
    }, [user]);

    const fetchRequestDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/request/${id}`);
            if (!response.ok) throw new Error("Failed to fetch request");
            const data = await response.json();
            setRequest(data[0]);
            console.table(request)
        } catch (error) {
            console.error(error);
        }
    };
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3001/request/comments/${id}`);
            if (!response.ok) throw new Error("Failed to fetch comments");
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
        setIsEdited(true);
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`http://localhost:3001/request/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: request.title,
                    description: request.description,
                    phone_number: request.phone_number,
                    status: request.status,
                }),
            });

            if (!response.ok) throw new Error("Failed to update request");

            setIsEdited(false);
        } catch (error) {
            console.error(error);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:3001/request/comments/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newComment, tech_id: user.id }),
            });

            if (!response.ok) throw new Error("Failed to add comment");

            setComments([...comments, { technician_name: user.name, message: newComment }]);
            setNewComment("");
        } catch (error) {
            console.error(error);
        }
    };

    if (!request) return <p>Loading...</p>;

    return (
        <div className="request-details-container">
            <div className="request-info">
                <h2>Заявка №{request.id}</h2>
                <p><strong>Клієнт:</strong> {request.client_name}</p>
                <p><strong>Email:</strong> {request.client_email}</p>

                <label>Назва:</label>
                <input type="text" name="title" value={request.title} onChange={handleChange} />

                <label>Опис:</label>
                <textarea name="description" value={request.description} onChange={handleChange} />

                <label>Номер телефону:</label>
                <input type="text" name="phone_number" value={request.phone_number} onChange={handleChange} />

                <label>Статус:</label>
                <select name="status" value={request.status} onChange={handleChange}>
                    <option value="new">Нова</option>
                    <option value="in_progress">В процесі</option>
                    <option value="completed">Завершена</option>
                </select>

                {isEdited && <button onClick={saveChanges}>Зберегти</button>}
            </div>

            <div className="comments-section">
                <h3>Коментарі</h3>
                <div className="comments-container">
                    {comments.map((comment, index) => (
                        <div key={index}>
                            <p><strong>{comment.technician_name}:</strong> {comment.message}</p>
                        </div>
                    ))}
                </div>

                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Додати коментар..." />
                <button onClick={addComment}>Додати</button>
            </div>
        </div>
    );
};

export default RequestDetails;