'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-foreground mb-6">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-foreground mt-10 mb-3 border-b border-border pb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-semibold text-foreground mt-6 mb-2 uppercase tracking-wide">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-4 text-sm text-muted-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-4 text-sm text-muted-foreground">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        code: ({ children, className }) => {
          const isBlock = !!className;
          return isBlock ? (
            <code className="block bg-muted text-foreground text-xs font-mono p-4 rounded-md overflow-x-auto mb-4 whitespace-pre">{children}</code>
          ) : (
            <code className="bg-muted text-foreground text-xs font-mono px-1.5 py-0.5 rounded">{children}</code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-border pl-4 text-sm text-muted-foreground italic mb-4">{children}</blockquote>
        ),
        hr: () => <hr className="border-border my-8" />,
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-border rounded-md overflow-hidden">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-muted text-muted-foreground">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-medium text-xs uppercase tracking-wide">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 border-t border-border text-muted-foreground">{children}</td>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-primary underline underline-offset-4 hover:text-primary/70 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}