import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 border-b pb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">{children}</h3>,
        p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
        code: ({ inline, children }) =>
          inline ? (
            <code className="bg-gray-100 text-indigo-600 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
          ) : (
            <code className="block bg-gray-900 text-green-300 p-4 rounded-lg my-4 overflow-x-auto text-sm font-mono whitespace-pre">{children}</code>
          ),
        pre: ({ children }) => <>{children}</>,
        table: ({ children }) => <table className="w-full border-collapse my-4 text-sm">{children}</table>,
        th: ({ children }) => <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold">{children}</th>,
        td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>,
        li: ({ children }) => <li className="ml-2">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        hr: () => <hr className="my-6 border-gray-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
