'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from './RichTextEditor';
import { uploadImage } from './uploadImage';
import { ReviewArticle } from '@/components/reviews/ReviewArticle';
import { CoverImage } from '@/components/ui/CoverImage';
import { Panel } from '@/components/ui/Panel';
import { renderPreview, saveArticle } from '@/lib/actions/articles';
import { EMPTY_DOC } from '@/lib/tiptapExtensions';
import { slugify } from '@/lib/format';

/**
 * @typedef {{ id: string, title: string, slug: string, excerpt: string | null, content: object,
 *   coverImage: string | null, gameTitle: string, platform: string | null, gameReleaseDate: string,
 *   score: number, status: 'DRAFT' | 'PUBLISHED', datePosted: string | null }} EditableArticle
 */

const UNSAVED_MESSAGE = 'You have unsaved changes. Leave anyway?';

/** @param {EditableArticle | null} article */
function initialFields(article) {
  return {
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    gameTitle: article?.gameTitle ?? '',
    platform: article?.platform ?? '',
    gameReleaseDate: article?.gameReleaseDate ?? '',
    score: article ? String(article.score) : '',
    excerpt: article?.excerpt ?? '',
    coverImage: article?.coverImage ?? '',
  };
}

/** Warn on tab close and on in-app link clicks while there are unsaved changes. */
function useUnsavedChangesWarning(dirty) {
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    const onClick = (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!link || link.target === '_blank' || e.defaultPrevented) return;
      if (!window.confirm(UNSAVED_MESSAGE)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('click', onClick, true);
    };
  }, [dirty]);
}

/**
 * Create / edit form for a review with Tiptap content, preview and
 * draft/publish actions.
 * @param {{ article: EditableArticle | null, authorName: string }} props
 */
export function ArticleEditor({ article, authorName }) {
  const router = useRouter();
  const [fields, setFields] = useState(() => initialFields(article));
  const [content, setContent] = useState(() => article?.content ?? EMPTY_DOC);
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState(article?.status ?? 'DRAFT');
  const [everPublished, setEverPublished] = useState(Boolean(article?.datePosted));
  const [preview, setPreview] = useState(/** @type {string | null} */ (null));
  const [coverBusy, setCoverBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const errorSummaryRef = useRef(null);

  useUnsavedChangesWarning(dirty);

  const slugLocked = everPublished;

  /** @param {keyof ReturnType<typeof initialFields>} name */
  const update = (name) => (e) => {
    const value = e.target.value;
    setFields((f) => {
      const next = { ...f, [name]: value };
      if (name === 'title' && !slugTouched && !slugLocked) next.slug = slugify(value);
      return next;
    });
    setDirty(true);
  };

  function onContentChange(json) {
    setContent(json);
    setDirty(true);
  }

  async function onCoverFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverBusy(true);
    setErrors((err) => ({ ...err, coverImage: '' }));
    try {
      const url = await uploadImage(file);
      setFields((f) => ({ ...f, coverImage: url }));
      setDirty(true);
    } catch (err) {
      setErrors((x) => ({ ...x, coverImage: err.message }));
    } finally {
      setCoverBusy(false);
      e.target.value = '';
    }
  }

  function save(intent) {
    setNotice('');
    startTransition(async () => {
      const result = await saveArticle({
        ...fields,
        slug: slugLocked ? undefined : fields.slug,
        id: article?.id,
        intent,
        content,
      });
      if (!result.ok) {
        setErrors(result.errors);
        requestAnimationFrame(() => errorSummaryRef.current?.focus());
        return;
      }
      setErrors({});
      setDirty(false);
      setStatus(result.status);
      if (result.status === 'PUBLISHED') setEverPublished(true);
      setFields((f) => ({ ...f, slug: result.slug }));
      setNotice(result.status === 'PUBLISHED' ? 'Published! Readers can see it now.' : 'Draft saved.');
      if (!article) {
        router.replace(`/admin/${result.id}/edit`);
      } else {
        router.refresh();
      }
    });
  }

  function togglePreview() {
    if (preview !== null) return setPreview(null);
    startTransition(async () => {
      setPreview(await renderPreview(content));
    });
  }

  const errorList = Object.entries(errors).filter(([, msg]) => msg);
  const isPublished = status === 'PUBLISHED';

  const previewArticle = {
    ...fields,
    score: Number(fields.score) || 0,
    gameReleaseDate: fields.gameReleaseDate ? new Date(`${fields.gameReleaseDate}T00:00:00Z`) : new Date(),
    datePosted: article?.datePosted ? new Date(article.datePosted) : new Date(),
    dateUpdated: new Date(),
    excerpt: fields.excerpt || null,
    coverImage: fields.coverImage || null,
  };

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        save('draft');
      }}
    >
      {/* Sticky action bar */}
      <div className="panel sticky top-[4.25rem] z-30 flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="mr-auto text-sm">
          Status:{' '}
          <strong className={isPublished ? 'text-teal-700' : 'text-grape-700'}>
            {isPublished ? 'Published' : 'Draft'}
          </strong>
          {dirty && <span className="ml-2 text-xs font-bold text-red-700">● Unsaved changes</span>}
        </span>
        <button type="button" className="btn-bevel btn-plain" onClick={togglePreview} aria-pressed={preview !== null} disabled={pending}>
          {preview !== null ? 'Back to editor' : 'Preview'}
        </button>
        <button type="submit" className="btn-bevel btn-grape" disabled={pending}>
          {isPublished ? 'Unpublish & save draft' : 'Save Draft'}
        </button>
        <button type="button" className="btn-bevel" onClick={() => save('publish')} disabled={pending}>
          {pending ? 'Working…' : isPublished ? 'Update' : 'Publish'}
        </button>
      </div>

      <p role="status" aria-live="polite" className="text-sm font-bold text-teal-300">
        {notice}
        {notice && isPublished && fields.slug && (
          <>
            {' '}
            <Link href={`/reviews/${fields.slug}`} className="text-teal-100">
              View it »
            </Link>
          </>
        )}
      </p>

      {errorList.length > 0 && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          className="border-2 border-red-700 bg-red-50 p-3 text-sm text-red-900"
        >
          <p className="font-bold">Please fix the following:</p>
          <ul className="list-disc pl-5">
            {errorList.map(([field, msg]) => (
              <li key={field}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {preview !== null ? (
        <div>
          <p className="mb-2 font-pixel text-[0.6rem] text-yellow-300">Preview: this is exactly what readers will see.</p>
          <ReviewArticle article={previewArticle} authorName={authorName} html={preview} />
        </div>
      ) : (
        <>
          <Panel title="Review details" as="div">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" name="title" error={errors.title} className="sm:col-span-2">
                <input id="title" className="field-input" value={fields.title} onChange={update('title')} required maxLength={200} />
              </Field>

              <Field
                label="Slug"
                name="slug"
                error={errors.slug}
                className="sm:col-span-2"
                hint={slugLocked ? 'Locked: the review has been published.' : `URL: /reviews/${fields.slug || '…'}`}
              >
                <input
                  id="slug"
                  className="field-input font-mono text-sm"
                  value={fields.slug}
                  readOnly={slugLocked}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update('slug')(e);
                  }}
                  onBlur={() => setFields((f) => ({ ...f, slug: slugify(f.slug) }))}
                />
              </Field>

              <Field label="Game title" name="gameTitle" error={errors.gameTitle}>
                <input id="gameTitle" className="field-input" value={fields.gameTitle} onChange={update('gameTitle')} required />
              </Field>

              <Field label="Platform" name="platform" error={errors.platform}>
                <input id="platform" className="field-input" value={fields.platform} onChange={update('platform')} placeholder="SNES, PS1, PC…" />
              </Field>

              <Field label="Game release date" name="gameReleaseDate" error={errors.gameReleaseDate}>
                <input
                  id="gameReleaseDate"
                  type="date"
                  className="field-input"
                  value={fields.gameReleaseDate}
                  onChange={update('gameReleaseDate')}
                  required
                />
              </Field>

              <Field label="Score (0–10)" name="score" error={errors.score} hint="One decimal place, e.g. 7.5">
                <input
                  id="score"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.1}
                  className="field-input"
                  value={fields.score}
                  onChange={update('score')}
                  required
                />
              </Field>

              <Field label="Excerpt" name="excerpt" error={errors.excerpt} className="sm:col-span-2" hint="One or two sentences for cards and search results.">
                <textarea id="excerpt" rows={2} maxLength={400} className="field-input" value={fields.excerpt} onChange={update('excerpt')} />
              </Field>

              <Field label="Cover image" name="coverImage" error={errors.coverImage} className="sm:col-span-2" hint="Upload a file or paste an https:// URL.">
                <div className="flex flex-wrap gap-2">
                  <input
                    id="coverImage"
                    className="field-input flex-1"
                    value={fields.coverImage}
                    onChange={update('coverImage')}
                    placeholder="/uploads/… or https://…"
                  />
                  <label className="btn-bevel btn-plain">
                    {coverBusy ? 'Uploading…' : 'Upload…'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                      className="sr-only"
                      onChange={onCoverFile}
                      disabled={coverBusy}
                    />
                  </label>
                  {fields.coverImage && (
                    <button
                      type="button"
                      className="btn-bevel btn-plain"
                      onClick={() => {
                        setFields((f) => ({ ...f, coverImage: '' }));
                        setDirty(true);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {fields.coverImage && (
                  <div className="mt-2 w-48">
                    <CoverImage src={fields.coverImage} alt="Cover image preview" />
                  </div>
                )}
              </Field>
            </div>
          </Panel>

          <Panel title="Article" as="div" bodyClassName="p-0 sm:p-0">
            {errors.content && <p className="field-error px-3 pt-2">{errors.content}</p>}
            <RichTextEditor initialContent={content} onChange={onContentChange} label="Article content" />
          </Panel>
        </>
      )}
    </form>
  );
}

/**
 * Labelled form field wrapper.
 * @param {{ label: string, name: string, error?: string, hint?: string, className?: string, children: React.ReactNode }} props
 */
function Field({ label, name, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
