import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Editor.css";

function Editor({ value, onChange, isEditing }) {

const formats = [
  "header", "font", "size", 
  "bold", "italic", "underline", 
  "list", "bullet", "align" 
];
  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        formats={formats}
        onChange={onChange}
        readOnly={!isEditing}
        modules={{
          toolbar: {
            container: "#editor-toolbar",
          },
        }}
      />
    </div>
  );
}

export default Editor;
