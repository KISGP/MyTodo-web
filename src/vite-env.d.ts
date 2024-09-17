/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import { LexicalEditor } from "lexical";

declare global {
  interface Window {
    editor?: LexicalEditor;
  }
}
