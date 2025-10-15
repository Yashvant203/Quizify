import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input className="w-full mb-3 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-3 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <button type="button" className="w-full mt-3 bg-gray-200 text-gray-800 py-2 rounded" onClick={async () => {
          const demoEmail = process.env.REACT_APP_DEMO_EMAIL || 'demo@example.com';
          const demoPass = process.env.REACT_APP_DEMO_PASSWORD || 'demoPass123';
          setEmail(demoEmail); setPassword(demoPass);
          await login(demoEmail, demoPass);
          navigate('/');
        }}>Use Demo Account</button>
        <div className="mt-4 text-center">
          <a href="/register" className="text-blue-600 underline">Create an account</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
