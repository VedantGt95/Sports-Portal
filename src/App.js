import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SubAdminForm from "./components/SubAdminForm";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/subadmin" element={<SubAdminForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
