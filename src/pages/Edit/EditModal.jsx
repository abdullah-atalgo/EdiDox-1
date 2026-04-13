
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Editor from "../../components/Editor/Editor";
import Header from "../../components/Header/Header";
import { getDocumentById, updateDocument } from "../../utils/storage";
import { Document, Page, pdfjs } from "react-pdf";
import "./EditModal.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function EditModal({ isOpen, setIsOpen, id }) {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null); // Container reference for Observer

  // States
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [extension, setExtension] = useState("txt");
  const [pdfUrl, setPdfUrl] = useState("");
  
  // PDF Viewer States
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const isEditing = location.pathname.startsWith("/edit");

  // 1. Load Document
  useEffect(() => {
    if (!id || !isOpen) return;
    const doc = getDocumentById(id);
    if (!doc) return;

    setContent(doc.content);
    setExtension(doc.extension || "docx");
  }, [id, isOpen]);

  // 2. Word Count Logic
  useEffect(() => {
    if (extension === "pdf") {
      setWordCount(0);
      return;
    }
    const text = content.replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
  }, [content, extension]);

  // 3. Autosave Logic
  useEffect(() => {
    if (!id || !isEditing || !isOpen) return;

    const timer = setTimeout(() => {
      updateDocument(id, {
        content,
        updatedAt: new Date().toLocaleString(),
        readOnly: false,
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [content, id, isEditing, isOpen]);

  // 4. PDF Blob Conversion
  useEffect(() => {
    if (extension !== "pdf" || !content || !isOpen) return;

    try {
      const cleanBase64 = content.replace(/<[^>]*>/g, "").trim();
      const base64String = cleanBase64.split(",")[1] || cleanBase64;
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Conversion failed", err);
    }
  }, [content, extension, isOpen]);

  // 5. Handlers
  const handleToggleEdit = () => {
    if (!id) return;
    navigate(isEditing ? `/view/${id}` : `/edit/${id}`);
  };

  const onExport = () => {
    if (extension === "pdf") {
      if (!pdfUrl) return;
      const element = document.createElement("a");
      element.href = pdfUrl;
      element.download = `document-${id || "download"}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([content.replace(/<[^>]*>/g, "\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `document-${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  // --- PDF SPECIFIC LOGIC ---
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const scrollToPage = (p) => {
    const pageElement = document.getElementById(`page_${p}`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setPageNumber(p);
    }
  };

  // Intersection Observer for PDF Scroll (Updated)
  useEffect(() => {
    if (extension !== "pdf" || !numPages || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const attr = entry.target.getAttribute("data-pagenumber");
            if (attr) {
              const p = parseInt(attr, 10);
              if (!isNaN(p)) {
                setPageNumber(p);
              }
            }
          }
        });
      },
      {
        threshold: 0.6,
        root: scrollContainerRef.current, // Use ref instead of document.querySelector
      }
    );

    const pages = document.querySelectorAll(".pdf-page-spacing");
    pages.forEach((page) => observer.observe(page));

    return () => observer.disconnect();
  }, [numPages, extension, scale, isOpen]); // Re-run when scale changes or modal opens

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="main-area">
          <div className="document-header">
            <Header
              isEditing={isEditing}
              wordCount={wordCount}
              onToggleEdit={handleToggleEdit}
              onExport={onExport}
              setIsOpen={setIsOpen}
              extension={extension}
              currentPage={pageNumber}
              totalPages={numPages}
              onZoomIn={() => setScale((s) => Math.min(s + 0.1, 2.0))}
              onZoomOut={() => setScale((s) => Math.max(s - 0.1, 0.5))}
              onRotate={() => setRotation((r) => (r + 90) % 360)}
              onNextPage={() => {
                if (pageNumber < numPages) scrollToPage(pageNumber + 1);
              }}
              onPrevPage={() => {
                if (pageNumber > 1) scrollToPage(pageNumber - 1);
              }}
              setPage={scrollToPage}
            />
          </div>

          <div className="editor-container" ref={scrollContainerRef}>
            {extension === "pdf" ? (
              <div
                className="pdf-viewer-container"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.3s",
                }}
              >
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<p style={{ color: "white" }}>Loading PDF...</p>}
                >
                  {numPages &&
                    Array.from(new Array(numPages), (el, index) => (
                      <div
                        key={`page_container_${index + 1}`}
                        id={`page_${index + 1}`}
                        className="pdf-page-spacing"
                        data-pagenumber={index + 1}
                        style={{ marginBottom: "20px" }}
                      >
                        <Page
                          pageNumber={index + 1}
                          scale={scale}
                          rotate={rotation}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    ))}
                </Document>
              </div>
            ) : (
              <div className="editor-wrapper">
                <Editor
                  value={content}
                  onChange={setContent}
                  isEditing={isEditing}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;