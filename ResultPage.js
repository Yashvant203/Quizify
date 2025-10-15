import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

const ResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  useEffect(() => { API.get(`/results/${id}`).then(res => setResult(res.data)).catch(() => setResult(null)); }, [id]);

  if (!result) return <div className="p-6">Loading...</div>;

  const percent = ((result.score / result.total) * 100).toFixed(1);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Result for {result.quiz?.title || 'Quiz'}</h2>
      <p className="mb-2">Score: {result.score} / {result.total} ({percent}%)</p>
      <p className="mb-4">Time taken: {Math.round(result.timeTakenSeconds)} seconds</p>
      <div className="space-y-3">
        {result.answers.map((a, idx) => (
          <div key={a.questionId} className="p-3 border rounded bg-white">
            <div className="font-medium">Q{idx+1}: {a.questionText || a.questionId}</div>
            <div>Selected: {typeof a.selected === 'number' ? String.fromCharCode(65 + a.selected) : a.selected}</div>
            <div>Correct: {a.isCorrect ? 'Yes' : 'No'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
