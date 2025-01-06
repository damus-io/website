import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export interface ParsedNote {
  note: Note
  parsed_content: ParsedContentBlock[];
  profile: Profile;
}

// This is a note, with the following constraints:
// Kind is always 0
// Content is a JSON string that can be parsed into a ProfileContent
export type Profile = Note;

export interface ProfileContent {
  name: string;
  about: string;
  deleted: boolean;
  display_name: string;
  picture: string;  // URL
  banner: string;  // URL
  nip05: string;  // Email-like address
  lud16: string;  // Email-like address
  displayName: string;
  // There are more fields, but we don't really care about them in this context
}

export interface ParsedContentBlock {
  text?: string;
  mention?: string;
  hashtag?: string;
  url?: string;
  indexed_mention?: string;
  invoice?: string;
}

export interface Note {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  content: string;
  tags: string[][];
  sig: string;
}

export interface NostrNoteViewProps {
  note: ParsedNote;
  className?: string;
  style?: React.CSSProperties;
}

export function NostrNoteView(props: NostrNoteViewProps) {
  const profileContent = useMemo(() => {  // JSON parsing is expensive, so we memoize it
    if (!props.note?.profile)
        return {name: "nostrich", displayName: "nostrich", picture: "https://damus.io/img/no-profile.svg"}
    return JSON.parse(props.note.profile.content) as ProfileContent;
  }, [props.note?.profile?.content]);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const displayName = profileContent.displayName || profileContent.name;

  useEffect(() => {
    let created_at = props.note?.note?.created_at || 0;
    setTimestamp(new Date(created_at * 1000).toLocaleDateString());
  }, [props.note?.note?.created_at]);

  return (
    <div className={cn("p-6 bg-white rounded-3xl shadow-lg border border-black/20 text-left", props.className)} style={props.style}>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3 text-xl">
          <Image
            src={profileContent.picture}
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
            alt={displayName}
          />
          <div className="flex flex-col">
            <div className="font-bold text-2xl text-gray-700">
              {displayName}
            </div>
            <div className="text-gray-400 text-sm">
              {timestamp}
            </div>
          </div>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap break-words">
          {props.note?.parsed_content?.map((block, i) => {
            return <NoteBlock key={i} block={block} />
          }) || null}
        </div>
      </div>
    </div>
  )
}

export function NoteBlock({ block }: { block: ParsedContentBlock }): JSX.Element | null {
  if (block.text) {
    return <span>{block.text}</span>;
  } else if (block.mention) {
    return <span className="text-damuspink-600 hover:underline"><a target="_blank" href={mentionLinkAddress(block.mention)}>@{shortenMention(block.mention)}</a></span>;
  } else if (block.url) {
    return (
      /\.(jpg|jpeg|png|gif)$/.test(block.url) ?
        <div className="my-2 flex items-center justify-center w-full h-auto max-h-96 overflow-hidden">
          <img src={block.url} className="w-full"/>
        </div>
        :
        <a href={block.url} target="_blank" rel="noopener noreferrer">{block.url}</a>
    );
  } else if (block.hashtag) {
    return <span className="text-damuspink-600 hover:underline"><a href={"damus:t:" + block.hashtag}>#{block.hashtag}</a></span>;
  } else {
    return null;
  }
}

function mentionLinkAddress(mention: string) {
  if (mention.startsWith("note")) {
    return "https://damus.io/" + mention;
  }
  else {
    return "https://njump.me/" + mention;
  }
}

function shortenMention(npub: string) {
  return npub.substring(0, 8) + ":" + npub.substring(npub.length - 8);
}
