import { renderRepoMarkdown } from '@/lib/render-md';

/**
 * Renders a markdown file from the great-minds repo root.
 * Server component — reads at build/request time.
 */
export default async function DocContent({
  file,
  source,
}: {
  file: string;
  source: string;
}) {
  let html: string;
  try {
    html = await renderRepoMarkdown(file);
  } catch {
    html = `<p>Could not load <code>${file}</code>. The file may have been moved or renamed.</p>`;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <code className="text-xs text-zinc-600 font-mono bg-zinc-900 px-2 py-1 rounded">
          {source}
        </code>
      </div>
      <div
        className="doc-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .doc-content { color: #d4d4d8; line-height: 1.75; }
        .doc-content h1 { font-size: 1.875rem; font-weight: 700; color: #fafafa; margin: 2rem 0 1rem; }
        .doc-content h2 { font-size: 1.375rem; font-weight: 600; color: #f4f4f5; margin: 2rem 0 0.75rem; border-bottom: 1px solid rgba(63,63,70,0.5); padding-bottom: 0.5rem; }
        .doc-content h3 { font-size: 1.125rem; font-weight: 600; color: #e4e4e7; margin: 1.5rem 0 0.5rem; }
        .doc-content p { margin: 0.75rem 0; }
        .doc-content ul, .doc-content ol { margin: 0.75rem 0; padding-left: 1.5rem; }
        .doc-content li { margin: 0.25rem 0; }
        .doc-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; background: #18181b; padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #a1a1aa; }
        .doc-content pre { background: #18181b; border: 1px solid #27272a; border-radius: 0.5rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
        .doc-content pre code { background: none; padding: 0; color: #d4d4d8; }
        .doc-content a { color: #f59e0b; text-decoration: none; }
        .doc-content a:hover { color: #fbbf24; text-decoration: underline; }
        .doc-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
        .doc-content th { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid #27272a; color: #a1a1aa; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .doc-content td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #27272a; }
        .doc-content blockquote { border-left: 2px solid rgba(245,158,11,0.4); padding-left: 1rem; margin: 1rem 0; color: #a1a1aa; font-style: italic; }
        .doc-content hr { border: none; border-top: 1px solid #27272a; margin: 2rem 0; }
        .doc-content strong { color: #f4f4f5; }
      `}</style>
    </div>
  );
}
