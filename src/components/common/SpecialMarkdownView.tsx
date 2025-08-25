import { motion } from "framer-motion";
import Markdown from "react-markdown";

type SpecialMarkdownViewProps = {
  children?: string | null | undefined;
  className?: string;
};

export function SpecialMarkdownView({ children, className }: SpecialMarkdownViewProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 1,
        staggerChildren: 1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0.6 },
    show: { opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      transition={{ duration: 0.5 }}
      variants={container}
      className={className}
    >
      <Markdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="opacity-90 font-bold text-6xl mb-6" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="opacity-90 font-bold text-4xl mb-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="opacity-90 font-bold text-2xl" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="opacity-80 list-disc list-inside mb-5" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="opacity-80 list-decimal list-inside mb-5" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="opacity-80 m-1" {...props} />
          ),
          em: ({ node, ...props }) => <i className="italic" {...props} />,
          strong: ({ node, children, className, ...props }) => (
            <motion.strong
              variants={item}
              className={`font-bold text-white ${className ?? ""}`}
              {...(props as any)}
            >
              {children}
            </motion.strong>
          ),
          p: ({ node, ...props }) => (
            <p className="opacity-80 mb-4" {...props} />
          ),
          a: ({ node, children, href, className, ...props }) => (
            <motion.a
              variants={item}
              className={`text-white font-bold underline ${className ?? ""}`}
              target="_blank"
              href={href}
              {...(props as any)}
            >
              {children}
            </motion.a>
          ),
          pre: ({ node, ...props }) => (
            <pre className="my-2 bg-white/10 overflow-scroll p-3 rounded-lg font-mono" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="my-2 bg-white/10 overflow-scroll p-1 font-mono rounded-sm" {...props} />
          ),
        }}
        className={className}
      >
        {children}
      </Markdown>
    </motion.div>
  );
}