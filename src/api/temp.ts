// API для работы с документами (только API, без localStorage)
export const documentApi = {
  // Получить документ по ID
  async getDocument(documentId: string): Promise<Document> {
    return await http.get<Document>(`/documents/${documentId}`);
  },

  // Сохранить документ
  async saveDocument(document: Document): Promise<Document> {
    return await http.post<Document>("/documents", document);
  },

  // Обновить документ
  async updateDocument(
    documentId: string,
    updates: Partial<Document>,
  ): Promise<Document> {
    return await http.put<Document>(`/documents/${documentId}`, updates);
  },

  // Удалить документ
  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    return await http.delete<{ success: boolean }>(`/documents/${documentId}`);
  },

  // Получить список документов пользователя
  async getUserDocuments(userId: string): Promise<Document[]> {
    return await http.get<Document[]>(`/users/${userId}/documents`);
  },

  // Поиск документов
  async searchDocuments(query: string, userId: string): Promise<Document[]> {
    return await http.get<Document[]>(
      `/documents/search?q=${encodeURIComponent(query)}&userId=${userId}`,
    );
  },

  // Экспорт документа
  async exportDocument(
    documentId: string,
    format: "txt" | "pdf" | "docx" = "txt",
  ): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/documents/${documentId}/export?format=${format}`,
      {
        method: "GET",
        headers: createAuthHeaders(),
      },
    );

    if (!response.ok) throw new Error("Ошибка экспорта");
    return response.blob();
  },

  // Восстановление документа из версии
  async restoreVersion(
    documentId: string,
    versionNumber: number,
  ): Promise<Document> {
    return await http.post<Document>(`/documents/${documentId}/restore`, {
      versionNumber,
    });
  },
};
