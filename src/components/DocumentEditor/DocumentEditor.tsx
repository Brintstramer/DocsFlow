import { useQuery, useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { http, queryClient } from "../../api/http";
import type { RootState } from "../../store/store";
import {
  setTitle,
  setContent,
  setAuthor,
  selectVersion,
  setCompareVersions,
  resetEditor,
} from "../../store/editorSlice";
import DiffViewer from "../DiffViewer/DiffViewer";
import VersionItem from "../VersionItem/VersionItem";
import { useParams, useNavigate } from "react-router-dom";
import type { Document, DocumentVersion } from "../../types/types";
import classes from "./DocumentEditor.module.css";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { useWebSocket } from "../../hooks/useWebSocket";

const DocumentEditor = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeEditors, setActiveEditors] = useState<
    { id: string; name: string; lastActive: string }[]
  >([]);

  const { title, content, author, compareVersions, isEdited } = useSelector(
    (state: RootState) => state.editor,
  );

  const {
    data: documentData,
    isLoading,
    error,
  } = useQuery<Document, Error>({
    queryKey: ["document", documentId],
    queryFn: () => http.get(`/documents/${documentId}`),
    enabled: !!documentId,
  });

  // Инициализация редактора после загрузки документа
  useEffect(() => {
    if (documentData) {
      dispatch(setTitle(documentData.title || ""));
      dispatch(setContent(documentData.content || ""));
      dispatch(setAuthor(localStorage.getItem("lastAuthor") || ""));
    }
  }, [documentData, dispatch]);

  // Mutation для сохранения версии
  const saveMutation = useMutation<Document, Error, Document>({
    mutationFn: (updatedDoc) =>
      http.put(`/documents/${updatedDoc.id}`, updatedDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      dispatch(resetEditor());
      if (author) localStorage.setItem("lastAuthor", author);
    },
  });

  const handleSave = useCallback(() => {
    if (!documentData) return;
    if (!author.trim()) {
      alert("Введите имя автора!");
      return;
    }

    const newVersion: DocumentVersion = {
      versionNumber: documentData.versions.length + 1,
      title,
      content,
      author,
      timestamp: new Date().toISOString(),
    };

    const updatedDocument: Document = {
      ...documentData,
      title,
      content,
      versions: [...documentData.versions, newVersion],
      updatedAt: new Date().toISOString(),
    };

    saveMutation.mutate(updatedDocument);
  }, [author, content, documentData, title, saveMutation]);

  // Восстановление версии
  const handleRestore = useCallback(
    (version: DocumentVersion) => {
      dispatch(setTitle(version.title || ""));
      dispatch(setContent(version.content || ""));
      dispatch(setAuthor(version.author || ""));
      dispatch(selectVersion(version));
    },
    [dispatch],
  );

  // Выбор версий для сравнения
  const handleSelectForDiff = (version: DocumentVersion) => {
    const { old, new: newV } = compareVersions;

    if (!old) {
      dispatch(setCompareVersions({ old: version }));
    } else if (!newV) {
      dispatch(setCompareVersions({ old, new: version }));
    } else {
      dispatch(setCompareVersions({ old: newV, new: version }));
    }
  };

  const handleClearDiff = () => dispatch(setCompareVersions({}));

  const handleContentChange = (newValue: string) => {
    dispatch(setContent(newValue));

    // Отправляем WS-сообщение о редактировании
    if (author.trim()) {
      sendMessage({
        type: "editing",
        documentId,
        user: { id: "local", name: author }, // "local" можно заменить на реальный userId
        timestamp: new Date().toISOString(),
      });
    }
  };

  const token = localStorage.getItem("accessToken"); // JWT
  const { lastMessage, sendMessage } = useWebSocket(
    "ws://localhost:3001/ws",
    token || undefined,
  );

  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    if (
      lastMessage.type === "document_updated" &&
      lastMessage.document?.id === documentId
    ) {
      console.log("📌 Документ изменился:", lastMessage.document);

      // ⚡ Обновляем кэш react-query напрямую без запроса к серверу
      queryClient.setQueryData<Document>(
        ["document", documentId],
        lastMessage.document,
      );
    }

    if (
      lastMessage.type === "editing" &&
      lastMessage.documentId === documentId
    ) {
      const editor = lastMessage.user as { id: string; name: string };
      setActiveEditors((prev) => {
        const others = prev.filter((e) => e.id !== editor.id);
        return [...others, { ...editor, lastActive: new Date().toISOString() }];
      });
    }
  }, [lastMessage, documentId]);

  // Очистка "устаревших" редакторов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEditors((prev) =>
        prev.filter(
          (e) => new Date().getTime() - new Date(e.lastActive).getTime() < 5000,
        ),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading)
    return <div className={classes.systemMessage}>Загрузка документа...</div>;
  if (error)
    return <div className={classes.systemMessage}>Ошибка: {error.message}</div>;
  if (!documentData)
    return <div className={classes.systemMessage}>Документ не найден</div>;

  return (
    <div className={classes.documentEditor}>
      <header className={classes.header}>
        <button
          onClick={() => navigate("/documents")}
          className={classes.backButton}
        >
          ← Назад к документам
        </button>
        <h1>Редактор документов</h1>
        <div className={classes.activeEditors}>
          {activeEditors.map((e) => (
            <div key={e.id} className={classes.editorIndicator}>
              ✏️ {e.name} редактирует...
            </div>
          ))}
        </div>
      </header>

      <div className={classes.editorSection}>
        <input
          className={classes.input}
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
          placeholder="Название документа"
        />
        {/* <textarea
          className={classes.textarea}
          value={content}
          onChange={(e) => dispatch(setContent(e.target.value))}
          placeholder="Содержание документа"
          rows={10}
        /> */}
        <RichTextEditor value={content} onChange={handleContentChange} />
        <input
          className={classes.input}
          value={author}
          onChange={(e) => dispatch(setAuthor(e.target.value))}
          placeholder="Автор"
        />
        <div className={classes.editorActions}>
          <button
            onClick={handleSave}
            disabled={!isEdited || saveMutation.isPending}
            className={classes.btnPrimary}
          >
            {saveMutation.isPending ? "Сохраняем..." : "Сохранить версию"}
          </button>
        </div>
        {saveMutation.isSuccess && (
          <div className={`${classes.systemMessage} ${classes.messageSuccess}`}>
            ✅ Версия успешно сохранена!
          </div>
        )}
      </div>

      <div className={classes.versionsSection}>
        <h2>История версий</h2>
        {[...documentData.versions].reverse().map((v) => (
          <VersionItem
            key={v.timestamp}
            version={v}
            isActive={
              compareVersions.old?.timestamp === v.timestamp ||
              compareVersions.new?.timestamp === v.timestamp
            }
            onRestore={handleRestore}
            onSelectForDiff={handleSelectForDiff}
          />
        ))}

        {compareVersions.old && compareVersions.new && (
          <div className={classes.diffViewerContainer}>
            <DiffViewer
              oldText={compareVersions.old.content}
              newText={compareVersions.new.content}
            />
            <button onClick={handleClearDiff} className={classes.btnSecondary}>
              Закрыть сравнение
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;
