/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import * as React from "react";
import { LexicalEditor } from "lexical";

declare global {
  interface Window {
    editor?: LexicalEditor;
  }

  namespace JSX {
    interface IntrinsicElements {
      item: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
