export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  count?: number;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  label: "red" | "yellow" | "green" | "blue";
  labelText: string;
  starred: boolean;
  unread: boolean;
  avatar?: string;
  initials: string;
  lastContact: string;
  snippet: string;
}

export interface Message {
  id: string;
  from: string;
  fromInitials: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  label?: "red" | "yellow" | "green" | "blue";
  labelText?: string;
}
