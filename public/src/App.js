import React from "react";
import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import Main from "./components/pages/publicPages/main/main";
import Login from "./components/pages/publicPages/login/login";
import Profile from "./components/pages/userModules/profile/profile";
import Crm from "./components/pages/techModules/crm/crm";
import RequestDetails from "./components/pages/techModules/requestDetails/requestDetails";


class App extends React.Component{
    state = {
        user: null,
    }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = async () => {

        const token = localStorage.getItem('token');

        if (!token) {
            console.warn('No token found in localStorage');
            this.setState({ user: null });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user');

            const data = await response.json();
            this.setState({ user: data });
            console.table(this.state.user)
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.clear();
        }
    };

    setUser = (user) => {
        this.setState({ user }, () => {
            console.log("Updated user state:", this.state.user);
        });
    };

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Main user={this.state.user}/>}/>
                    <Route path="/login" element={<Login setUser={this.setUser}/>}/>
                    <Route path="/profile" element={<Profile user={this.state.user}/>}/>
                    <Route path="/crm" element={<Crm user={this.state.user}/>}/>
                    <Route path="/crm/request/:id" element={<RequestDetails user={this.state.user}/>}/>
                </Routes>
            </Router>
        )
    }
}

export default App;
