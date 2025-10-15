import { useEffect, useState } from "react";
import API from "../api/api";
import QuizCard from "../components/QuizCard";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => { API.get('/quizzes').then(res => setQuizzes(res.data)); }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-6 font-bold">Available Quizzes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(q => (
          <QuizCard key={q._id} quiz={q} />
        ))}
      </div>
    </div>
  );
};

export default QuizList;
