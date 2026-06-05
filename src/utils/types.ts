export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  count?: number;
}

export type PresetLabel = "red" | "yellow" | "green" | "blue" | "purple";
export type LabelColor = PresetLabel | string;

export interface Message {
  id: string;
  person_id?: string;
  msg_from: string;
  from_initials: string;
  msg_to: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  label?: LabelColor;
  labelText?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  label: LabelColor;
  labelText?: string;
  starred: boolean;
  unread: boolean;
  status?: "inbox" | "starred" | "bin";
  avatar?: string;
  initials?: string;
  lastContact: string;
  snippet: string;
  messages: Message[];
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    status?: "inbox" | "starred" | "bin";
  };
  created_at?: string;
  updated_at?: string;
}
