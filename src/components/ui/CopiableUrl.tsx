import React from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const CopiableUrl = ({ url, className }: { url: string; className?: string }) => {
  return (
    <div className={cn("flex items-center justify-between rounded-md bg-purple-200/20", className)}>
      <div className="w-full text-sm text-purple-200/50 font-normal px-4 py-2 overflow-x-scroll">
        {url}
      </div>
      <button
        className="text-sm text-purple-200/50 font-normal px-4 py-2 active:text-purple-200/30 hover:text-purple-200/80 transition"
        onClick={() => navigator.clipboard.writeText(url || "")}
      >
        <Copy />
      </button>
    </div>
  );
};

export default CopiableUrl;
