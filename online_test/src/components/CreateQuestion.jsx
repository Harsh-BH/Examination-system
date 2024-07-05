import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateQuestion.css";

const CreateQuestion = () => {
  const { testId } = useParams();
  const [questionType, setQuestionType] = useState("single-mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [paragraphAnswer, setParagraphAnswer] = useState("");
  const [multipleCorrectOptions, setMultipleCorrectOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      const testDoc = await getDoc(doc(db, "tests", testId));
      if (testDoc.exists()) {
        setTestTitle(testDoc.data().title);
      }
    };
    fetchTest();
  }, [testId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        question,
        questionType,
        createdAt: new Date(),
      };

      if (questionType === "single-mcq" || questionType === "multiple-mcq") {
        questionData.options = options;
      }

      if (questionType === "single-mcq") {
        questionData.correctOption = correctOption;
      } else if (questionType === "multiple-mcq") {
        questionData.correctOptions = multipleCorrectOptions;
      } else if (questionType === "paragraph") {
        questionData.answer = paragraphAnswer;
      }

      await addDoc(collection(db, "tests", testId, "questions"), questionData);
      navigate(`/test-details/${testId}`);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <div className="create-question-container">
      <h2>Create Question for {testTitle}</h2>
      <form onSubmit={handleSubmit} className="create-question-form">
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          required
        >
          <option value="single-mcq">Single Choice MCQ</option>
          <option value="multiple-mcq">Multiple Choice MCQ</option>
          <option value="paragraph">Paragraph</option>
        </select>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          required
        />
        {questionType === "single-mcq" && (
          <>
            {options.map((option, index) => (
              <div key={index} className="option-container">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
            <input
              type="text"
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              placeholder="Correct Option"
              required
            />
          </>
        )}
        {questionType === "multiple-mcq" && (
          <>
            {options.map((option, index) => (
              <div key={index} className="option-container">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <input
                  type="checkbox"
                  value={option}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMultipleCorrectOptions((prev) =>
                      e.target.checked
                        ? [...prev, value]
                        : prev.filter((opt) => opt !== value)
                    );
                  }}
                />
              </div>
            ))}
          </>
        )}
        {questionType === "paragraph" && (
          <textarea
            value={paragraphAnswer}
            onChange={(e) => setParagraphAnswer(e.target.value)}
            placeholder="Paragraph Answer"
            required
          />
        )}
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default CreateQuestion;
