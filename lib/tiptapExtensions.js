import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

/**
 * Single source of truth for the article schema. Used by the editor (client)
 * and by the server-side HTML renderer so preview === published output.
 * StarterKit v3 already includes Link and Underline.
 */
export const articleExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https', 'mailto'],
      HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: null },
    },
  }),
  Image.configure({ inline: false, allowBase64: false }),
];

/** An empty Tiptap document. */
export const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };
