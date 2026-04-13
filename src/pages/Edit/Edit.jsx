
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
      
      <Sidebar setIsOpen={setIsOpen} />

     
      <EditModal 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        id={id} 
      />
    </div>
  );
}

export default Edit;
