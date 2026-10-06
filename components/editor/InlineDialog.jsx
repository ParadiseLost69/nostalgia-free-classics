'use client';

import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Small modal built on the native <dialog> element (focus trapping and Esc
 * handling come for free). Portalled to <body> so its <form> never nests
 * inside the article form.
 * @param {{ open: boolean, title: string, onClose: () => void, children: React.ReactNode }} props
 */
export function InlineDialog({ open, title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return createPortal(
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      className="panel w-[min(28rem,calc(100vw-2rem))] p-0 backdrop:bg-ink/70"
    >
      <div className="title-bar">
        <h2 id={titleId} className="flex-1 text-sm">
          {title}
        </h2>
        <button type="button" onClick={onClose} className="btn-bevel btn-plain px-1.5 py-0 text-xs" aria-label="Close">
          ✕
        </button>
      </div>
      <div className="panel-body">{open && children}</div>
    </dialog>,
    document.body,
  );
}
