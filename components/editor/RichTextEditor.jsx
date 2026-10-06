'use client';

import { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import { articleExtensions } from '@/lib/tiptapExtensions';
import { EditorToolbar } from './EditorToolbar';
import { InlineDialog } from './InlineDialog';
import { uploadImage } from './uploadImage';

/**
 * Tiptap editor with toolbar, link dialog and image-upload dialog.
 * @param {{ initialContent: object, onChange: (json: object) => void, label: string }} props
 */
export function RichTextEditor({ initialContent, onChange, label }) {
  const [dialog, setDialog] = useState(/** @type {null | 'link' | 'image'} */ (null));

  const editor = useEditor({
    extensions: [...articleExtensions, Placeholder.configure({ placeholder: 'Press Start to write…' })],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap article-content px-4 py-3',
        'aria-label': label,
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON()),
  });

  if (!editor) {
    return <div className="min-h-96 border-2 border-grape-900 bg-white p-4 text-sm">Loading editor…</div>;
  }

  return (
    <div className="border-2 border-grape-900 bg-white">
      <EditorToolbar editor={editor} onLink={() => setDialog('link')} onImage={() => setDialog('image')} />
      <EditorContent editor={editor} />

      <InlineDialog open={dialog === 'link'} title="Insert link" onClose={() => setDialog(null)}>
        <LinkForm editor={editor} onDone={() => setDialog(null)} />
      </InlineDialog>
      <InlineDialog open={dialog === 'image'} title="Insert image" onClose={() => setDialog(null)}>
        <ImageForm editor={editor} onDone={() => setDialog(null)} />
      </InlineDialog>
    </div>
  );
}

function LinkForm({ editor, onDone }) {
  const [href, setHref] = useState(() => editor.getAttributes('link').href ?? '');
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    e.stopPropagation();
    const value = href.trim();
    if (!value) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      onDone();
      return;
    }
    if (!/^(https?:\/\/|mailto:|\/)/i.test(value)) {
      setError('Links must start with https://, http://, mailto: or /.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <label htmlFor="link-href" className="field-label">
        URL
      </label>
      <input
        id="link-href"
        className="field-input"
        value={href}
        onChange={(e) => setHref(e.target.value)}
        placeholder="https://"
        autoFocus
        aria-describedby="link-help"
      />
      <p id="link-help" className="field-hint">
        Select text first to turn it into a link. Leave empty to remove a link.
      </p>
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-bevel btn-plain" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn-bevel">
          Apply
        </button>
      </div>
    </form>
  );
}

function ImageForm({ editor, onDone }) {
  const [file, setFile] = useState(/** @type {File | null} */ (null));
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!file) return setError('Choose an image file.');
    if (!alt.trim()) return setError('Alt text is required.');
    setBusy(true);
    setError('');
    try {
      const src = await uploadImage(file);
      editor.chain().focus().setImage({ src, alt: alt.trim() }).run();
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label htmlFor="image-file" className="field-label">
          Image file
        </label>
        <input
          id="image-file"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          className="field-input"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>
      <div>
        <label htmlFor="image-alt" className="field-label">
          Alt text (required)
        </label>
        <input
          id="image-alt"
          className="field-input"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          required
          aria-describedby="image-alt-help"
        />
        <p id="image-alt-help" className="field-hint">
          Describe what the image shows, e.g. &ldquo;Mario mid-jump over a pit in World 1-1&rdquo;.
        </p>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-bevel btn-plain" onClick={onDone}>
          Cancel
        </button>
        <button type="submit" className="btn-bevel" disabled={busy}>
          {busy ? 'Uploading…' : 'Upload & insert'}
        </button>
      </div>
    </form>
  );
}
