import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CallerBoard from './pages/CallerBoard';
import ViewerScreen from './pages/ViewerScreen';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/caller" element={<CallerBoard />} />
        <Route path="/viewer" element={<ViewerScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
