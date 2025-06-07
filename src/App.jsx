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
  <div className="min-h-screen bg-primary-100 text-neutral-800">
    <Header />
    <main className="pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
    <footer className="bg-primary-200 border-t border-primary-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-semibold text-neutral-800 mb-4">
              Ticketi
            </h3>
            <p className="text-neutral-600">
              Your one-stop destination for event tickets.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/event-list" className="text-neutral-600 hover:text-primary-600">Events</a></li>
              <li><a href="/create-event" className="text-neutral-600 hover:text-primary-600">Host Event</a></li>
              <li><a href="/my-tickets" className="text-neutral-600 hover:text-primary-600">My Tickets</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-neutral-600">support@ticketi.com</li>
              <li className="text-neutral-600">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-300 text-center text-neutral-600">
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
