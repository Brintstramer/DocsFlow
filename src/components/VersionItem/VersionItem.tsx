import type { FC } from "react";
import type { DocumentVersion } from "../../types/types";
import classes from "./VersionItem.module.css";

interface VersionItemProps {
  version: DocumentVersion;
  isActive: boolean;
  onRestore: (version: DocumentVersion) => void;
  onSelectForDiff: (version: DocumentVersion) => void;
}

const VersionItem: FC<VersionItemProps> = ({
  version,
  isActive,
  onRestore,
  onSelectForDiff,
}) => {
  const date = new Date(version.timestamp).toLocaleString();

  return (
    <div className={`${classes.versionItem} ${isActive ? classes.active : ""}`}>
      <div className={classes.versionHeader}>
        <div className={classes.versionTitle}>
          Версия {version.versionNumber}
        </div>
        <div className={classes.versionDate}>{date}</div>
      </div>
      <div className={classes.versionTitle}>Автор: {version.author}</div>
      <div>
        <button
          className={`${classes.btnSmall} ${classes.btnSecondary}`}
          onClick={() => onSelectForDiff(version)}
        >
          Сравнить
        </button>
        <button
          className={`${classes.btnSmall} ${classes.btnPrimary}`}
          onClick={() => onRestore(version)}
        >
          Восстановить
        </button>
      </div>
    </div>
  );
};

export default VersionItem;
