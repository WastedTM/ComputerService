import "./styles.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Profile = ({ user }) => {
    const [requests, setRequests] = useState([]);
    const [selectedRequestIndex, setSelectedRequestIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newRequest, setNewRequest] = useState({ title: "", description: "", phone_number: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch("http://localhost:3001/requests/user/" + user.id);
            if (!response.ok) throw new Error("Failed to fetch requests");
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error(error);
        }
    };

    const selectRequest = (index) => {
        setSelectedRequestIndex(index === selectedRequestIndex ? null : index);
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const createRequest = async () => {
        if (!newRequest.title.trim() || !newRequest.description.trim() || !newRequest.phone_number.trim()) return;

        try {
            const response = await fetch("http://localhost:3001/request/user/" + user.id, {
                method: "POST",
                headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${localStorage.getItem("token")}`},
                body: JSON.stringify({ ...newRequest}),
            });

            if (!response.ok) throw new Error("Failed to create request");

            closeModal();
            fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile__container">
            <button onClick={() => navigate("/")} className="home-btn">Home</button>
            <h2 className="profile-title">Welcome, {user.name}</h2>
            <p className="profile-email">Email: {user.email}</p>

            <h3 className="requests-title">Your Requests</h3>
            <ul className="request-list">
                {requests.map((request, index) => (
                    <li key={request.id} className="request-item">
                        <div onClick={() => selectRequest(index)} className="request-summary">
                            Request number №{request.id} - <strong>{request.status}</strong>
                        </div>
                        {selectedRequestIndex === index && (
                            <div className="request-details">
                                <h3>Details:</h3>
                                <p><strong>Title:</strong> {request.title}</p>
                                <p><strong>Description:</strong> {request.description}</p>
                                <p><strong>Contact Phone:</strong> {request.phone_number}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <button className="create-request-btn" onClick={openModal}>Create Request</button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>Create a New Request</h3>
                        <input
                            type="text"
                            value={newRequest.title}
                            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                            placeholder="Title"
                            required
                        />
                        <textarea
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            placeholder="Description"
                            required
                        />
                        <input
                            type="text"
                            value={newRequest.phone_number}
                            onChange={(e) => setNewRequest({ ...newRequest, phone_number: e.target.value })}
                            placeholder="Phone Number"
                            required
                        />
                        <button className="submit-btn" onClick={createRequest}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;