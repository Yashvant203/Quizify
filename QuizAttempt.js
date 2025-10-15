import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    API.post(`/quizzes/${id}/start`).then(res => setQuiz(res.data));
  }, [id]);

  if (!quiz) return <div className="p-6">Loading...</div>;

  const handleSelect = (qId, idx) => setAnswers({ ...answers, [qId]: idx });

  const handleSubmit = async () => {
    const payload = { quizId: quiz.quizId, answers: Object.entries(answers).map(([qId, selected]) => ({ questionId: qId, selected })), timeTakenSeconds: 300 };
    const res = await API.post('/results', payload);
    navigate(`/result/${res.data._id}`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{quiz.title || quiz.quizId}</h2>
        <Timer seconds={(quiz.duration || 30) * 60} onExpire={handleSubmit} />
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <QuestionCard key={q.id} q={q} selected={answers[q.id]} onSelect={handleSelect} index={idx} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSubmit} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">Submit Quiz</button>
      </div>
    </div>
  );
};

export default QuizAttempt;
