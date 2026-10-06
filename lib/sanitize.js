import DOMPurify from 'isomorphic-dompurify';

const ARTICLE_TAGS = [
  'p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
  'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'img',
];
const ARTICLE_ATTRS = ['href', 'target', 'rel', 'src', 'alt', 'title', 'start'];

// Force safe link attributes on every anchor that survives sanitization.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('href')) {
    const href = node.getAttribute('href') ?? '';
    if (/^https?:\/\//i.test(href)) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    } else {
      node.removeAttribute('target');
    }
  }
});

/**
 * Sanitize rendered rich-text (article) HTML.
 * @param {string} html
 */
export function sanitizeArticleHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ARTICLE_TAGS,
    ALLOWED_ATTR: ARTICLE_ATTRS,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/(?!\/)|#)/i,
  });
}

/**
 * Comments are plain text: strip every tag, normalise whitespace, trim.
 * React escapes text on render, so this is defence in depth.
 * @param {string} input
 */
export function sanitizeCommentText(input) {
  const stripped = DOMPurify.sanitize(String(input ?? ''), { ALLOWED_TAGS: [], KEEP_CONTENT: true });
  return stripped
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
