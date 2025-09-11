declare module "react-draft-wysiwyg" {
  import { ComponentType } from "react";
  import { EditorState } from "draft-js";

  export interface EditorProps {
    editorState: EditorState;
    onEditorStateChange?: (editorState: EditorState) => void;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbarClassName?: string;
    [key: string]: unknown; // для остальных пропсов
  }

  export const Editor: ComponentType<EditorProps>;
}
