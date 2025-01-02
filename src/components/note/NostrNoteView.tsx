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
}

export function NostrNoteView(props: NostrNoteViewProps) {
  return (
    <div className="shadow-xl text-red-500">
      {props.note.note.content}
    </div>
  )
}
