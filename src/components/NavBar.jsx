import { Link } from "react-router-dom"

function NavBar(){
    return (
        <nav ClassName="navbar">
            <h2>Event Ticketing</h2>
            <ul>/
                <li><Link to="/">Home</Link></li>
                <li><Link to="/create-event">Create Event</Link></li>
                <li><Link to="/event-list">Event List</Link></li>
            </ul>

        </nav>
    )
}
export default NavBar