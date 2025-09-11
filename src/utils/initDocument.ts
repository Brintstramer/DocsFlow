import type { Document, GenDocument } from "../types/types";

export const initializeDocumentFromTemplate = (doc: GenDocument): Document => {
  return {
    id: doc.id,
    title: doc.name || "Новый документ",
    content: `Документ: ${doc.name}\n\nСгенерирован: ${new Date().toLocaleDateString()}\n\nШаблон: ${doc.template}`,
    versions: [],
    createdAt: doc.createdAt,
    updatedAt: new Date().toISOString(),
    templateType: doc.template,
    originalData: doc.data,
  };
};

// const initializeDocumentFromTemplate = (templateDoc: GenDocument): Document => {
//   return {
//     id: templateDoc.id,
//     title: templateDoc.name || "Новый документ", // ← значение по умолчанию
//     content: templateDoc.data ? JSON.stringify(templateDoc.data) : "", // ← значение по умолчанию
//     versions: [], // ← обязательно массив
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     // ... другие обязательные поля
//   };
// };
