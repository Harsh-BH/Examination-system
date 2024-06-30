import React, { useState, useEffect, useRef } from "react";

const AddQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [editIndex, setEditIndex] = useState(null);
  const [showPaper, setShowPaper] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load questions from local storage on component mount
    const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    setQuestions(savedQuestions);
  }, []);

  const handleAddQuestion = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newQuestion = {
          name: file.name,
          content: e.target.result,
          type: "Simple type",
        };
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);
        localStorage.setItem("questions", JSON.stringify(updatedQuestions));
      };
      reader.readAsText(file);
    } else {
      alert("Please select a text file.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
  };

  const handleWriteQuestion = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setQuestionContent("");
    setOptions(["", "", "", ""]);
    setQuestionType("MCQ");
    setEditIndex(null);
  };

  const handleSaveQuestion = () => {
    const newQuestion = {
      name: `Question_${questions.length + 1}`,
      content: questionContent,
      type: questionType,
      options: questionType === "MCQ" ? options : [],
    };
    if (editIndex !== null) {
      const updatedQuestions = questions.map((question, index) =>
        index === editIndex ? newQuestion : question
      );
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } else {
      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
    }
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    closeModal();
  };

  const handleEditQuestion = (index) => {
    setEditIndex(index);
    setQuestionContent(questions[index].content);
    setQuestionType(questions[index].type || "MCQ");
    setOptions(questions[index].options || ["", "", "", ""]);
    setShowModal(true);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleMergeQuestions = () => {
    setShowPaper(true);
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case "MCQ":
        return (
          <div key={index} style={styles.questionContainer}>
            <p>{question.content}</p>
            {question.options.map((option, i) => (
              <div key={i}>
                <input
                  type="radio"
                  id={`q${index}o${i}`}
                  name={`question_${index}`}
                />
                <label htmlFor={`q${index}o${i}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      case "Fill in the Blanks":
        return (
          <div key={index} style={styles.questionContainer}>
            <p>{question.content}</p>
            <input
              type="text"
              style={styles.blankInput}
              placeholder="Answer here"
            />
          </div>
        );
      case "Simple type":
      default:
        return (
          <div key={index} style={styles.questionContainer}>
            <p>{question.content}</p>
            <textarea
              style={styles.simpleTypeAnswer}
              placeholder="Write your answer here..."
            ></textarea>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Saved Questions</h2>
      <div style={styles.buttonContainer}>
        <input
          type="file"
          accept="text/plain"
          onChange={handleAddQuestion}
          ref={fileInputRef}
          style={styles.fileInput}
        />
        <button style={styles.button} onClick={triggerFileInput}>
          Add Question
        </button>
        <button style={styles.button} onClick={handleWriteQuestion}>
          Write Question
        </button>
        <button style={styles.button} onClick={handleMergeQuestions}>
          Merge Questions
        </button>
      </div>
      <div style={styles.questionList}>
        {questions.length === 0 ? (
          <div style={styles.noQuestionsMessage}>
            No questions added. Please add some questions.
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={index} style={styles.questionItem}>
              {renderQuestion(question, index)}
              <button
                onClick={() => handleEditQuestion(index)}
                style={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={() => handleRemoveQuestion(index)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeader}>Write Question</h2>
            <textarea
              style={styles.textArea}
              placeholder="Write your question here..."
              value={questionContent}
              onChange={(e) => setQuestionContent(e.target.value)}
            ></textarea>
            <div style={styles.modalButtonContainer}>
              <label>
                Question type:
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Fill in the Blanks">Fill in the Blanks</option>
                  <option value="Simple type">Simple type</option>
                </select>
              </label>
              {questionType === "MCQ" && (
                <div style={styles.optionsContainer}>
                  {options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      style={styles.optionInput}
                    />
                  ))}
                </div>
              )}
              <button style={styles.modalButton} onClick={handleSaveQuestion}>
                Save
              </button>
              <button style={styles.modalButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaper && (
        <div style={styles.paperContainer}>
          <h2 style={styles.paperHeader}>Examination Paper</h2>
          {questions.map((question, index) => (
            <div key={index} style={styles.paperQuestionItem}>
              {renderQuestion(question, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    padding: "20px",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    border: "1px solid #000",
    borderRadius: "10px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    marginLeft: "10px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  fileInput: {
    display: "none",
  },
  questionList: {
    width: "100%",
    marginBottom: "20px",
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  questionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #000",
    borderRadius: "5px",
    fontSize: "18px",
    width: "90%",
  },
  removeButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  editButton: {
    marginTop: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  noQuestionsMessage: {
    fontSize: "18px",
    color: "#777",
    marginTop: "20px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "600px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  textArea: {
    width: "100%",
    height: "200px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #000",
    boxSizing: "border-box",
  },
  modalButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  modalButton: {
    padding: "10px 20px",
    marginLeft: "10px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
  },
  optionInput: {
    marginBottom: "5px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #000",
  },
  questionContainer: {
    width: "100%",
    padding: "10px",
    borderBottom: "1px solid #000",
    marginBottom: "10px",
  },
  blankInput: {
    display: "block",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #000",
    marginTop: "10px",
  },
  simpleTypeAnswer: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #000",
    marginTop: "10px",
  },
  paperContainer: {
    width: "100%",
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  paperHeader: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
  },
  paperQuestionItem: {
    marginBottom: "20px",
  },
};

export default AddQuestions;
