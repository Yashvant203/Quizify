import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/quizzes" className="p-4 bg-green-200 rounded hover:bg-green-300">Quizzes</Link>
        <Link to="/results" className="p-4 bg-yellow-200 rounded hover:bg-yellow-300">Results & Analytics</Link>
      </div>
    </div>
  );
};

export default Dashboard;
