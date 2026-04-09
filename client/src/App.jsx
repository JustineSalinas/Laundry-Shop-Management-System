import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import StatusMonitoring from './pages/StatusMonitoring';

function App() {
  return (
    <Router>
      <Routes>
        {/* We make Login the default route for now */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/status" element={<StatusMonitoring />} />
      </Routes>
    </Router>
  );
}

export default App;
