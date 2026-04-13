import mammoth from "mammoth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveDocument } from "../../utils/storage";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // reset state
    setError("");
    setFileName(file.name);

    // Extension validation
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "docx" && extension !== "pdf") {
      setError("Please upload .docx or .pdf only");
      return;
    }

    // MIME type validation (extra safety)
    const validMime = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (file.type && !validMime.includes(file.type)) {
      setError("Invalid file type");
      return;
    }

    // Empty file validation
    if (file.size === 0) {
      setError("File is empty");
      return;
    }

    try {
      const extension = file.name.split(".").pop().toLowerCase();
      let finalContent = "";

      if (extension === "docx") {
        // Process DOCX to HTML for Quill Editor
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Normal'] => p:fresh",
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p => p:fresh",
            ],
            includeDefaultStyleMap: true,
            preserveEmptyParagraphs: true,
          },
        );
        finalContent = result.value;
      } else if (extension === "pdf") {
        finalContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const doc = {
        id: crypto.randomUUID(),
        title: file.name.replace(`.${extension}`, ""),
        updatedAt: new Date().toLocaleString(),
        content: finalContent,
        readOnly: true,
      };

      // Persist document with extension type
      saveDocument(doc, extension);
      navigate(`/edit/${doc.id}`);
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message || "File processing failed");
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h2 className="upload-title">Upload Document</h2>
        <p className="upload-subtitle">
          Upload a DOCX or a pdf file to view or edit
        </p>

        {/* Custom upload box */}
        <label className="upload-box">
          <input type="file" accept=".docx,.pdf" onChange={handleFile} hidden />

          <span className="upload-btn">Choose File</span>
          <span className="upload-filename">
            {fileName || "No file chosen"}
          </span>
        </label>

        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  );
}

export default Upload;
