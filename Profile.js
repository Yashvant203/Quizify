import { useState, useEffect, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (user) setEmail(user.email); }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/me', { email, password });
      setMsg('Saved');
      await refreshUser();
    } catch (err) { setMsg('Error'); }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Profile</h2>
      <form onSubmit={handleSave}>
        <label className="block mb-2">Email</label>
        <input className="w-full mb-3 p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-2">New password (leave blank to keep)</label>
        <input type="password" className="w-full mb-3 p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
    </div>
  );
};

export default Profile;
