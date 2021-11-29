import "./App.css";
import { SocketProvider } from "./context";
import { Chat, Init, Login } from "./screens";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/user";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/join" element={<Init />} />
              <Route path="/chat/:room" element={<Chat />} />
            </Routes>
          </Router>
        </UserProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
