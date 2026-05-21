export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  count?: number;
}

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
  label?: "red" | "yellow" | "green" | "blue" | "purple";
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
  label: "red" | "yellow" | "green" | "blue" | "purple";
  labelText?: string;
  starred: boolean;
  unread: boolean;
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
  };
  created_at?: string;
  updated_at?: string;
}
