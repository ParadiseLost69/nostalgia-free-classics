import 'server-only';
import { renderToHTMLString } from '@tiptap/static-renderer/pm/html-string';
import { articleExtensions } from './tiptapExtensions';
import { sanitizeArticleHtml } from './sanitize';

/**
 * Render stored Tiptap JSON to sanitized HTML. Server only.
 * @param {unknown} content Tiptap JSON document
 * @returns {string}
 */
export function renderArticleHtml(content) {
  if (!content || typeof content !== 'object') return '';
  try {
    const html = renderToHTMLString({ content, extensions: articleExtensions });
    return sanitizeArticleHtml(html);
  } catch (err) {
    console.error('Failed to render article content', err);
    return '<p><em>This article could not be rendered.</em></p>';
  }
}

/**
 * Collect every image in a document so the server can require alt text.
 * @param {any} node
 * @param {Array<{ src?: string, alt?: string }>} [acc]
 */
export function findImages(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (node.type === 'image') acc.push(node.attrs ?? {});
  if (Array.isArray(node.content)) node.content.forEach((child) => findImages(child, acc));
  return acc;
}

/**
 * Plain-text excerpt from a document (used when no excerpt is provided).
 * @param {any} node
 * @param {number} [max]
 */
export function plainTextExcerpt(node, max = 200) {
  const parts = [];
  (function walk(n) {
    if (!n || parts.join(' ').length > max) return;
    if (n.type === 'text' && n.text) parts.push(n.text);
    if (Array.isArray(n.content)) n.content.forEach(walk);
  })(node);
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
