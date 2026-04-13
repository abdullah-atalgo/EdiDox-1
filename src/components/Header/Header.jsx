import "react-quill/dist/quill.snow.css";
import "./Header.css";
import {
  Download,
  FilePenLine,
  EyeIcon,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Header({
  isEditing,
  setIsOpen,
  wordCount,
  onToggleEdit,
  onExport,
  extension,
  onZoomIn,
  onZoomOut,
  onRotate,
  currentPage,
  totalPages,
  setPage,
}) {
  const isPdf = extension === "pdf";

  return (
    <header className={`editor-header ${isPdf ? "pdf-view" : ""}`}>
      {/* LEFT SECTION: Editor Tools (Hidden if PDF) */}
      {!isPdf && (
        <div
          id="editor-toolbar"
          className={`toolbar-left ql-toolbar ql-snow ${!isEditing ? "toolbar-disabled" : ""}`}
        >
          <select className="ql-header" disabled={!isEditing}>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="">Normal</option>
          </select>
          <span className="ql-formats">
            <select className="ql-font"></select>
            <select className="ql-size"></select>
          </span>
          <span className="ql-formats">
            <select className="ql-align"></select>
          </span>
          <button className="ql-bold" disabled={!isEditing} />
          <button className="ql-italic" disabled={!isEditing} />
          <button className="ql-underline" disabled={!isEditing} />
          <button className="ql-list" value="ordered" disabled={!isEditing} />
          <button className="ql-list" value="bullet" disabled={!isEditing} />
        </div>
      )}

      {/* MIDDLE SECTION: PDF Controls (Only if PDF) */}
      {isPdf && (
        <div className="pdf-controls-wrapper">
          <div className="pdf-group">
            <button
              className="pdf-btn"
              onClick={() => {
                if (currentPage > 1) {
                  setPage(currentPage - 1);
                }
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              className="pdf-btn"
              onClick={() => {
                if (currentPage < totalPages) {
                  setPage(currentPage + 1); 
                }
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="divider" />
          <div className="pdf-group">
            <button className="pdf-btn" onClick={onZoomOut}>
              <ZoomOut size={18} />
            </button>
            <button className="pdf-btn" onClick={onZoomIn}>
              <ZoomIn size={18} />
            </button>
            <button className="pdf-btn" onClick={onRotate}>
              <RotateCw size={18} />
            </button>
          </div>
          <div className="divider" />
          {/* <button className="pdf-btn" onClick={() => window.print()}>
            <Printer size={18} />
          </button> */}
        </div>
      )}

      {/* RIGHT SECTION: Actions (Download & Close ALWAYS here) */}
      <div className="toolbar-right">
        {!isPdf && (
          <>
            <span className="word-count">{wordCount} words</span>
            <button className="edit-toggle-btn" onClick={onToggleEdit}>
              {isEditing ? <EyeIcon size={18} /> : <FilePenLine size={18} />}
            </button>
          </>
        )}

        {/* Buttons on the RIGHT side */}
        <button className="export-btn" onClick={onExport}>
          <Download size={18} />
        </button>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <X size={18} />
        </button>
      </div>
    </header>
  );
}
export default Header;
