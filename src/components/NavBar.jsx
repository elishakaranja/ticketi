import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function NavBar(){
    const { user, logout } = useAuth()

    return (
        <nav className="navbar">
            <h2>Event Ticketing</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/event-list">Events</Link></li>
                {user ? (
                    <>
                        <li><Link to="/create-event">Create Event</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}
export default NavBar