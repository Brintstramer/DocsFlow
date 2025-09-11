import type { FC } from "react";
import classes from "./DiffViewer.module.css";

interface DiffViewerProps {
  oldText: string;
  newText: string;
}

const DiffViewer: FC<DiffViewerProps> = ({ oldText, newText }) => {
  if (!oldText || !newText) {
    return null;
  }
  // Простой алгоритм сравнения (в реальном приложении используйте библиотеку diff)
  const renderDiff = () => {
    if (oldText === newText) {
      return <div>Изменений нет</div>;
    }

    return (
      <div className={classes.diffViewer}>
        <h4>Сравнение содержания:</h4>
        <div>
          <strong>Было:</strong>
        </div>
        <div className={classes.diffRemoved}>{oldText}</div>
        <div style={{ marginTop: "10px" }}>
          <strong>Стало:</strong>
        </div>
        <div className={classes.diffAdded}>{newText}</div>
      </div>
    );
  };

  return renderDiff();
};

export default DiffViewer;
