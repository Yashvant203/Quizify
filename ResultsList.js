import { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

const ResultsList = () => {
  const [results, setResults] = useState([]);
  useEffect(() => { API.get('/results/me').then(res => setResults(res.data)).catch(() => setResults([])); }, []);

  if (!results) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Your Results</h2>
      {results.length === 0 && <div>No results yet.</div>}
      <ul className="space-y-3">
        {results.map(r => (
          <li key={r._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{r.quiz?.title || 'Quiz'}</div>
              <div className="text-sm text-gray-600">Score: {r.score} / {r.total} — {Math.round((r.score/r.total)*100)}%</div>
            </div>
            <div>
              <Link to={`/result/${r._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">View</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsList;
