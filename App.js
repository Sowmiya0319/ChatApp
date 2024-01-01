import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import './style.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/Auth';

function App() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/Login" />;
    }
    return children
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
