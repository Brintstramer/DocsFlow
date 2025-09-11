import { useState, useEffect, useCallback, type FC } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
  type RawDraftContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import classes from "./RichTextEditor.module.css";

// Type guard для DraftJS raw
function isDraftRaw(raw: unknown): raw is RawDraftContentState {
  return (
    typeof raw === "object" &&
    raw !== null &&
    "blocks" in raw &&
    "entityMap" in raw
  );
}

const RichTextEditor: FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(),
  );

  // обновление при изменении value
  useEffect(() => {
    if (!value) {
      setEditorState(EditorState.createEmpty());
      return;
    }

    try {
      const parsed: unknown = JSON.parse(value);

      if (isDraftRaw(parsed)) {
        const contentState = convertFromRaw(parsed);
        setEditorState(EditorState.createWithContent(contentState));
        return;
      }
    } catch {
      // если не JSON — упадём в fallback
    }

    // fallback: plain text
    const text = value.trim();
    const contentState = ContentState.createFromText(text);
    setEditorState(EditorState.createWithContent(contentState));
  }, [value]);

  const handleEditorChange = useCallback(
    (state: EditorState) => {
      setEditorState(state);
      const raw = convertToRaw(state.getCurrentContent());
      onChange(JSON.stringify(raw));
    },
    [onChange],
  );

  return (
    <div className={classes.editorWrapper}>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName={classes.wrapper}
        editorClassName={classes.editor}
        toolbarClassName={classes.toolbar}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            "image",
            "remove",
            "history",
          ],
          blockType: { inDropdown: true },
          fontSize: {
            options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Impact",
              "Tahoma",
              "Times New Roman",
              "Verdana",
            ],
          },
        }}
      />
    </div>
  );
};

export default RichTextEditor;
