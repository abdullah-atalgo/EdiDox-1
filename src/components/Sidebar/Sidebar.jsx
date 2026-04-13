import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteDocument, getDocuments } from "../../utils/storage";
import "./Sidebar.css";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Search 
} from "lucide-react";
function Sidebar({  setIsOpen }) {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setDocuments(getDocuments());
  }, []);

  const handleDelete = (id) => {
    deleteDocument(id);
    setDocuments(getDocuments());
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="sidebar-container">
      
        <aside className="sidebar">
          <div className="sidebar-top">
            <button className="new-doc-btn" onClick={() => navigate("/upload")}>
              <Plus size={20} /> New Document
            </button>

            <input
              type="text"
              placeholder="Search documents"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="doc-list">
            {filteredDocs.length === 0 ? (
              <p className="empty-text">No documents found</p>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="doc-item"  onClick={() => {  navigate(`/edit/${doc.id}?mode=view`); setIsOpen(true);}}>
                  <div
                    className="doc-info"
                   
                  >
                    <p className="doc-title">{doc.title}</p>
                    <span className="doc-date">{doc.updatedAt}</span>
                  </div>

                  <div className="doc-actions">
                    <button
                      className="doc-edit-btn"
                      title="Edit document"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                        navigate(`/edit/${doc.id}?mode=edit`);
                      }}
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      className="doc-delete-btn"
                      title="Delete document"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      
    </div>
  );
}

export default Sidebar;
