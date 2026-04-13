import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit/Edit";
import Upload from "./pages/Upload/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Edit />} />

        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/view/:id" element={<Edit />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
