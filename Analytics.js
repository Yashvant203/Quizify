import { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { Bar } from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    API.get('/results/analytics/all').then(res => setData(res.data)).catch(() => setData([]));
  }, [user]);

  if (!user || user.role !== 'admin') return <div className="p-6">Admins only</div>;

  const labels = data.map(d => d.title);
  const scores = data.map(d => d.avgScore);
  const attempts = data.map(d => d.attempts);

  const chartData = {
    labels,
    datasets: [
      { label: 'Avg Score %', data: scores, backgroundColor: 'rgba(54,162,235,0.6)' },
      { label: 'Attempts', data: attempts, backgroundColor: 'rgba(255,99,132,0.6)' }
    ]
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Analytics</h2>
      <div className="mb-6 bg-white p-4 rounded shadow">
        <Bar data={chartData} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg mb-2">Raw data</h3>
        <table className="w-full text-left">
          <thead><tr><th>Quiz</th><th>Avg Score %</th><th>Attempts</th></tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.quizId}><td>{d.title}</td><td>{d.avgScore}</td><td>{d.attempts}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
