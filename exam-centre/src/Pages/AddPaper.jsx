import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";

const AddPaper = () => {
  const [papers, setPapers] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paperContent, setPaperContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load papers and drafts from local storage on component mount
    const savedPapers = JSON.parse(localStorage.getItem("papers")) || [];
    const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];
    setPapers(savedPapers);
    setDrafts(savedDrafts);
  }, []);

  const handleAddPaper = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPaper = { name: file.name, content: e.target.result };
        const updatedPapers = [...papers, newPaper];
        setPapers(updatedPapers);
        localStorage.setItem("papers", JSON.stringify(updatedPapers));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a PDF file.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemovePaper = (index) => {
    const updatedPapers = papers.filter((_, i) => i !== index);
    setPapers(updatedPapers);
    localStorage.setItem("papers", JSON.stringify(updatedPapers));
  };

  const handleRemoveDraft = (index) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
  };

  const handleWritePaper = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPaperContent("");
    setEditIndex(null);
  };

  const handleSavePaper = () => {
    const doc = new jsPDF();
    doc.text(paperContent, 10, 10);
    const pdfData = doc.output("datauristring");
    const newPaper = {
      name: `Paper_${papers.length + 1}.pdf`,
      content: pdfData,
    };
    const updatedPapers = [...papers, newPaper];
    setPapers(updatedPapers);
    localStorage.setItem("papers", JSON.stringify(updatedPapers));

    // Remove draft if it is being edited
    if (editIndex !== null) {
      const updatedDrafts = drafts.filter((_, i) => i !== editIndex);
      setDrafts(updatedDrafts);
      localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    }

    closeModal();
  };

  const handleSaveDraft = () => {
    if (editIndex !== null) {
      const updatedDrafts = drafts.map((draft, index) =>
        index === editIndex ? { content: paperContent } : draft
      );
      setDrafts(updatedDrafts);
      localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    } else {
      const newDraft = { content: paperContent };
      const updatedDrafts = [...drafts, newDraft];
      setDrafts(updatedDrafts);
      localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    }
    closeModal();
  };

  const handleEditDraft = (index) => {
    setEditIndex(index);
    setPaperContent(drafts[index].content);
    setShowModal(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Saved Papers</h2>
      <div style={styles.buttonContainer}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleAddPaper}
          ref={fileInputRef}
          style={styles.fileInput}
        />
        <button style={styles.button} onClick={triggerFileInput}>
          Add Paper
        </button>
        <button style={styles.button} onClick={handleWritePaper}>
          Write Paper
        </button>
      </div>
      <div style={styles.paperList}>
        {papers.length === 0 && drafts.length === 0 ? (
          <div style={styles.noPapersMessage}>
            No papers added. Please add some papers.
          </div>
        ) : (
          <>
            {papers.map((paper, index) => (
              <div key={index} style={styles.paperItem}>
                <a
                  href={paper.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.paperLink}
                >
                  {paper.name}
                </a>
                <button
                  onClick={() => handleRemovePaper(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
            {drafts.map((draft, index) => (
              <div key={index} style={styles.paperItem}>
                <span style={styles.draftText}>
                  Draft: {`Draft_${index + 1}`}
                </span>
                <button
                  onClick={() => handleEditDraft(index)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveDraft(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalHeader}>Write Paper</h2>
            <textarea
              style={styles.textArea}
              placeholder="Write your paper here..."
              value={paperContent}
              onChange={(e) => setPaperContent(e.target.value)}
            ></textarea>
            <div style={styles.modalButtonContainer}>
              <button style={styles.modalButton} onClick={handleSavePaper}>
                Save as PDF
              </button>
              <button style={styles.modalButton} onClick={handleSaveDraft}>
                Save as Draft
              </button>
              <button style={styles.modalButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
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
  paperList: {
    width: "100%",
    marginBottom: "20px",
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paperItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #000",
    borderRadius: "5px",
    fontSize: "18px",
    width: "90%",
  },
  paperLink: {
    flexGrow: 1,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  editButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  draftText: {
    flexGrow: 1,
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
  },
  noPapersMessage: {
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
};

export default AddPaper;
