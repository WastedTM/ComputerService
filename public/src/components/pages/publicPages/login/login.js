import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();

            localStorage.setItem("token", data.token);
            setUser(data.user);

            navigate(data.user.role === "client" ? "/profile" : "/crm");

        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="wrapper">
            <section className="split-form">
                <div className="image-side">
                    <h2>Welcome Back!</h2>
                    <p>Enter your details to access your account</p>
                </div>
                <div className="form-side">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <input type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
                        <button type="submit">Login</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </section>
        </div>
    );
}

export default Login;