import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizList from "./pages/QuizList";
import QuizAttempt from "./pages/QuizAttempt";
import ResultPage from "./pages/ResultPage";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Register from "./pages/Register";
import ResultsList from "./pages/ResultsList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/quizzes" element={<PrivateRoute><QuizList /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><QuizAttempt /></PrivateRoute>} />
          <Route path="/result/:id" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><ResultsList /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
