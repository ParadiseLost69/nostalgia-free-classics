'use client';

import { useEditorState } from '@tiptap/react';

/**
 * @param {{ label: string, onClick: () => void, active?: boolean, disabled?: boolean, children: React.ReactNode }} props
 */
function ToolButton({ label, onClick, active = false, disabled = false, children }) {
  return (
    <button
      type="button"
      className="btn-bevel btn-plain min-w-8 px-2 py-0.5"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px self-center bg-grape-300" />;
}

/**
 * @param {{ editor: import('@tiptap/react').Editor, onLink: () => void, onImage: () => void }} props
 */
export function EditorToolbar({ editor, onLink, onImage }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      link: e.isActive('link'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap gap-1 border-b-2 border-grape-900 bg-grape-100 p-1.5">
      <ToolButton label="Heading 2" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolButton>
      <ToolButton label="Heading 3" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolButton>
      <Separator />
      <ToolButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <strong>B</strong>
      </ToolButton>
      <ToolButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <em className="font-serif">I</em>
      </ToolButton>
      <ToolButton label="Underline" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
        <span className="underline">U</span>
      </ToolButton>
      <ToolButton label="Link" active={state.link} onClick={onLink}>
        🔗
      </ToolButton>
      <Separator />
      <ToolButton label="Bullet list" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
        • List
      </ToolButton>
      <ToolButton label="Numbered list" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
        1. List
      </ToolButton>
      <ToolButton label="Blockquote" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
        “ ”
      </ToolButton>
      <ToolButton label="Horizontal rule" onClick={() => chain().setHorizontalRule().run()}>
        ―
      </ToolButton>
      <ToolButton label="Insert image" onClick={onImage}>
        🖼 Image
      </ToolButton>
      <Separator />
      <ToolButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        ↶
      </ToolButton>
      <ToolButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        ↷
      </ToolButton>
    </div>
  );
}
