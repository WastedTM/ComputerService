import "./styles.css";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Сrm = ({user}) => {

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:3001/requests/technician/" + user.id);
            if (!response.ok) throw new Error("Failed to fetch requests");
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="dashboard__container">
            <a href="/" className="home-btn">Home</a>
            <h2>Мої заявки</h2>

            <table className="requests-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Опис</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {requests.map((request) => (
                    <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>{request.description}</td>
                        <td>{request.status}</td>
                        <td>{new Date(request.created_at).toLocaleString("uk-UA")}</td>
                        <td>
                            <button onClick={() => navigate(`/crm/request/${request.id}`)}>
                                Детальніше
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Сrm;