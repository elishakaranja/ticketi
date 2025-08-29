import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";

const Layout = ({ children }) => (
  <div >
    <Header />
    <main >
      <div >
        {children}
      </div>
    </main>
    <footer >
      <div >
        <div >
          <div>
            <h3 >
              Ticketi
            </h3>
            <p >
              Your one-stop destination for event tickets.
            </p>
          </div>
          <div>
            <h4 >Quick Links</h4>
            <ul >
              <li><a href="/event-list" >Events</a></li>
              <li><a href="/create-event" >Host Event</a></li>
              <li><a href="/my-tickets" >My Tickets</a></li>
            </ul>
          </div>
          <div>
            <h4 >Contact</h4>
            <ul >
              <li >support@ticketi.com</li>
              <li >+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div >
          © {new Date().getFullYear()} Ticketi. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/event-list" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/my-tickets" element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;