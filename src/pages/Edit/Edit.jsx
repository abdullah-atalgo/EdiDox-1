// import { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Sidebar from "../../components/Sidebar/Sidebar";
// import EditModal from "./EditModal";
// import { getDocumentById, updateDocument } from "../../utils/storage";
// import "./Edit.css";

// function Edit() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isOpen, setIsOpen] = useState(false);
//   const [content, setContent] = useState("");
//   const [wordCount, setWordCount] = useState(0);
//   const [extension, setExtension] = useState("txt");
//   const [pdfUrl, setPdfUrl] = useState("");

//   const isEditing = location.pathname.startsWith("/edit");

//   // 1. Load Document Logic
//   useEffect(() => {
//     if (!id) return;
//     const doc = getDocumentById(id);
//     if (!doc) return;

//     setContent(doc.content);
//     setExtension(doc.extension || "docx");
//   }, [id]);

//   // 2. Word Count Logic (Stripping HTML)
//   useEffect(() => {
//     if (extension === "pdf") {
//       setWordCount(0);
//       return;
//     }
//     const text = content.replace(/<[^>]*>/g, "").trim();
//     const words = text ? text.split(/\s+/).length : 0;
//     setWordCount(words);
//   }, [content, extension]);

//   // 3. Autosave Logic
//   useEffect(() => {
//     if (!id || !isEditing) return;

//     const timer = setTimeout(() => {
//       updateDocument(id, {
//         content,
//         updatedAt: new Date().toLocaleString(),
//         readOnly: false,
//       });
//     }, 800);

//     return () => clearTimeout(timer);
//   }, [content, id, isEditing]);

//   // 4. PDF Blob Conversion
//   useEffect(() => {
//     if (extension !== "pdf" || !content) return;

//     try {
//       const cleanBase64 = content.replace(/<[^>]*>/g, "").trim();
//       const base64String = cleanBase64.split(",")[1] || cleanBase64;

//       const byteCharacters = atob(base64String);
//       const byteNumbers = new Array(byteCharacters.length);
//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }
//       const byteArray = new Uint8Array(byteNumbers);
//       const blob = new Blob([byteArray], { type: "application/pdf" });

//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);

//       return () => URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("PDF Conversion failed", err);
//     }
//   }, [content, extension]);

//   // 5. Handlers
//   const handleToggleEdit = () => {
//     if (!id) return;
//     navigate(isEditing ? `/view/${id}` : `/edit/${id}`);
//   };

//  const onExport = () => {
//   if (extension === "pdf") {
//     if (!pdfUrl) return; 
    
//     const element = document.createElement("a");
//     element.href = pdfUrl;
//     element.download = `document-${id || "download"}.pdf`; 
//     document.body.appendChild(element); 
//     element.click();
//     document.body.removeChild(element);
//     return;
//   }

//   const element = document.createElement("a");
//   const file = new Blob([content.replace(/<[^>]*>/g, "\n")], {
//     type: "text/plain",
//   });
//   element.href = URL.createObjectURL(file);
//   element.download = `document-${id}.txt`;
//   document.body.appendChild(element);
//   element.click();
//   document.body.removeChild(element);
//   URL.revokeObjectURL(element.href);
// };

  
//   return (
//     <div className={`app-layout ${!isOpen ? "sidebar-closed" : ""}`}>
//       <Sidebar setIsOpen={setIsOpen} />

//       <EditModal
//         isOpen={isOpen}
//         setIsOpen={setIsOpen}
//         extension={extension}
//         isEditing={isEditing}
//         wordCount={wordCount}
//         onToggleEdit={handleToggleEdit}
//         onExport={onExport}
//         content={content}
//         setContent={setContent}
//         pdfUrl={pdfUrl}
//       />
//     </div>
//   );
// }

// export default Edit;

import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import EditModal from "./EditModal";
import "./Edit.css";

function Edit() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`app-layout ${!isOpen ? "sidebar-closed" : ""}`}>
      {/* Sidebar handles opening the modal */}
      <Sidebar setIsOpen={setIsOpen} />

      {/* Saari heavy lifting ab Modal ke andar hogi */}
      <EditModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        id={id} 
      />
    </div>
  );
}

export default Edit;