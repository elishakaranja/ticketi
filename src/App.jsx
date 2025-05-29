import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import "./App.css";
import EventList from "./pages/EventList";
import NavBar from "./components/NavBar"


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/create-event" element={<CreateEvent/>}/>
        <Route path="/event-list" element={<EventList/>}/>

        
      </Routes>
    </Router>
  );
}

export default App;
