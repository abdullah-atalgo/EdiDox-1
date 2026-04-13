const STORAGE_KEY = "documents";

export function getDocuments() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDocument(doc, extension = "txt") {
  const docs = getDocuments();
  const newDoc = { 
    ...doc, 
    extension, // 👈 Store extension here
    updatedAt: new Date().toLocaleString() 
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newDoc, ...docs]));
}

export function getDocumentById(id) {
  const docs = getDocuments();
  return docs.find((doc) => doc.id === id);
}

export function getDocumentExtension(id) {
  const doc = getDocumentById(id);
  return doc ? doc.extension : "txt";
}

export function deleteDocument(id) {
  const docs = getDocuments().filter((doc) => doc.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function updateDocument(id, updates) {
  const docs = getDocuments();

  const updatedDocs = docs.map((doc) =>
    doc.id === id
      ? {
          ...doc,
          ...updates,
          updatedAt: new Date().toLocaleString(), // ✅ time + date
        }
      : doc
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocs));
}
