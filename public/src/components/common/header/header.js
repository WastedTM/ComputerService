import './header.css';
import {Link} from "react-router-dom";

const Header = ({user}) => {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <header>
            <h1>Computer Service</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contacts">Contacts</Link></li>
                    <li>
                        {user ? (
                            user.role === 'technician' ? (
                                <Link to="/crm">Dashboard</Link>
                            ) : (
                                <Link to="/profile">Profile</Link>
                            )
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </li>
                    {user ? <li>
                        <a onClick={handleLogout}>Logout</a>
                    </li> : null
                    }

                </ul>
            </nav>
        </header>
    );
}

export default Header;