import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchPersonal, fetchTemplates, genWordDoc } from "../store/thunk";
import type { Document, TemplateData, Templates } from "../types/types";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function Documents() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loading, error, templates, personal } = useSelector(
    (state: RootState) => state.doc,
  );

  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof Templates>("intLetter");
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchPersonal());
  }, [dispatch]);

  // Загружаем список документов через React Query
  const {
    data: documents = [],
    isLoading: isLoadingDocs,
    isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<Document[]> => {
      const res = await http.get<Document[]>("/documents");
      return res;
    },
  });

  const recipient = personal.find((p) => p.id === recipientId);
  const sender = personal.find((p) => p.id === senderId);

  const data: TemplateData = useMemo(
    () => ({
      recipient_name: recipient?.name ?? "",
      recipient_position: recipient?.position ?? "",
      recipient_workshop: recipient?.workshop ?? "",

      sender_name: sender?.name ?? "",
      sender_position: sender?.position ?? "",
      sender_workshop: sender?.workshop ?? "",

      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }),
    [recipient, sender],
  );

  const baseName = `${selectedTemplate}-${recipient?.name || "document"}`;

  const createDocument = useMutation({
    mutationFn: async () => {
      const newDocument = {
        title: baseName,
        content: JSON.stringify(data),
        versions: [],
      };

      const res = await http.post<Document>("/documents", newDocument);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (err) => {
      console.error("Ошибка создания документа:", err);
    },
  });

  const handleGenerateDocument = async () => {
    if (!templates || !recipient || !sender) return;

    // 1. Сначала генерируем Word-документ и скачиваем
    await dispatch(
      genWordDoc({
        templateFile: templates[selectedTemplate], // путь к docx-шаблону
        data,
        baseName,
      }),
    );

    // 2. Потом сохраняем в БД
    createDocument.mutate();
  };

  const handleEditVersions = (documentId: string) => {
    navigate(`/documents/${documentId}/versions`);
  };

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (err) => {
      console.error("Ошибка удаления документа:", err);
    },
  });

  if (loading && !templates) return <p>Загрузка базы...</p>;
  if (error && !templates) {
    return <p style={{ color: "crimson" }}>Ошибка загрузки: {error}</p>;
  }
  if (!templates) {
    return null;
  }

  return (
    <div style={{ padding: 20, display: "grid", gap: 16, maxWidth: 800 }}>
      <h1>Генерация документа Word</h1>

      {/* Секция генерации нового документа */}
      <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
        <h2>Создать новый документ</h2>
        <div>
          <label>Выберите документ: </label>
          <select
            value={selectedTemplate}
            onChange={(event) =>
              setSelectedTemplate(event.target.value as keyof Templates)
            }
            disabled={loading}
          >
            <option value="intLetter">Внутреннее письмо</option>
            <option value="extLetter">Внешнее письмо</option>
            <option value="order">Приказ</option>
            <option value="instruction">Распоряжение</option>
          </select>
        </div>

        <div>
          <label>Выберите получателя: </label>
          <select
            value={recipientId ?? ""}
            onChange={(e) => setRecipientId(e.target.value)}
            disabled={loading}
          >
            <option value="">--не выбрано--</option>
            {personal.map((item) => (
              <option key={item.id} value={item.id}>
                {item.workshop} — {item.position} — {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Выберите отправителя: </label>
          <select
            value={senderId ?? ""}
            onChange={(e) => setSenderId(e.target.value)}
            disabled={loading}
          >
            <option value="">--не выбрано--</option>
            {personal.map((item) => (
              <option key={item.id} value={item.id}>
                {item.workshop} — {item.position} — {item.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateDocument}
          disabled={
            loading || !recipientId || !senderId || createDocument.isPending
          }
          style={{ marginTop: 16 }}
        >
          {createDocument.isPending ? "Генерация..." : "Создать документ"}
        </button>

        {error && <p style={{ color: "crimson" }}>Ошибка: {error}</p>}
      </div>

      {/* Секция истории документов */}
      <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8 }}>
        <h2>История документов</h2>
        {isLoadingDocs ? (
          <p>Загрузка документов...</p>
        ) : isError ? (
          <p style={{ color: "crimson" }}>Ошибка загрузки документов</p>
        ) : documents.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {documents.map((doc, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{doc.title}</div>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    {new Date(doc.createdAt).toLocaleDateString("ru-RU")}
                  </div>
                </div>
                <button
                  onClick={() => handleEditVersions(doc.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Управление версиями
                </button>
                <button
                  onClick={() => deleteDocument.mutate(doc.id)}
                  disabled={deleteDocument.isPending}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "crimson",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {deleteDocument.isPending ? "Удаление..." : "Удалить"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#666", marginTop: 40 }}>
            <p>Здесь будут отображаться созданные документы</p>
            <p>Создайте первый документ, чтобы начать работу с версиями</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Documents;
