import React from 'react'
import Markdown from 'react-markdown'

export function MarkdownView({ children, className }: { children?: string | null | undefined, className?: string }) {
  return (
    <Markdown components={{
      h1: ({node, ...props}) => <h1 className="opacity-90 font-bold text-3xl md:text-6xl mb-6" {...props} />,
      h2: ({node, ...props}) => <h2 className="opacity-90 font-bold text-2xl md:text-4xl mb-4" {...props} />,
      h3: ({node, ...props}) => <h3 className="opacity-90 font-bold text-xl md:text-2xl" {...props} />,
      ul: ({node, ...props}) => <ul className="opacity-80 list-disc list-inside mb-5" {...props} />,
      ol: ({node, ...props}) => <ol className="opacity-80 list-decimal list-inside mb-5" {...props} />,
      li: ({node, ...props}) => <li className="opacity-80 m-1" {...props} />,
      em: ({node, ...props}) => <i className="italic" {...props} />,
      strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
      p: ({node, ...props}) => <p className="opacity-80 mb-4" {...props} />,
      a: ({node, ...props}) => <a className="text-damuspink-600 underline" {...props} />,
      pre: ({node, ...props}) => <pre className="my-2 bg-white/10 overflow-scroll p-3 rounded-lg font-mono" {...props} />,
      code: ({node, ...props}) => {
        return (<code className="my-2 bg-white/10 overflow-scroll p-1 font-mono rounded-sm" {...props} />)
      },
    }} className={className}>{children}</Markdown>
  )
}
