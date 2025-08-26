import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchPersonal, fetchTemplates, genWordDoc } from "../store/docThunk";
import type { TemplateData, Templates } from "../types/types";
import { useEffect, useMemo, useState } from "react";

function Documents() {
  const dispatch = useDispatch<AppDispatch>();
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

  const baseName = `${selectedTemplate}-${recipient?.name}`;

  if (loading && !templates) return <p>Загрузка базы...</p>;
  if (error && !templates) {
    return <p style={{ color: "crimson" }}>Ошибка загрузки: {error}</p>;
  }
  if (!templates) {
    return null;
  }
  console.log(personal);

  return (
    <div style={{ padding: 20, display: "grid", gap: 16, maxWidth: 560 }}>
      <h1>Генерация документа Word</h1>
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
          <option>--не выбрано--</option>
          {personal.map((item) => (
            <option key={`${item.id}`} value={item.id}>
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
          <option>--не выбрано--</option>
          {personal.map((item) => (
            <option key={`${item.id}`} value={item.id}>
              {item.workshop} — {item.position} — {item.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          dispatch(
            genWordDoc({
              templateFile: templates[selectedTemplate],
              data,
              baseName,
            }),
          );
        }}
        disabled={loading || !recipientId || !senderId}
      >
        {loading ? "Генерация..." : "Создать документ"}
      </button>

      {error && <p style={{ color: "crimson" }}>Ошибка: {error}</p>}
    </div>
  );
}

export default Documents;
