import type { Person, Message } from "./types";

let personIdCounter = 1;
let messageIdCounter = 1;

const STORAGE_KEY = "moddb_people";
const STORAGE_VERSION_KEY = "moddb_version";
const DATA_VERSION = "1.2";

const labelMap: Record<string, string> = {
  blue: "DMS",
  yellow: "PlusVenture",
  green: "Sales",
  red: "HR",
  purple: "EX",
};

export function getLabelText(label: string): string {
  return labelMap[label] || "Personal";
}

export function generatePersonId(): string {
  return `${personIdCounter++}`;
}

export function generateMessageId(): string {
  return `msg_${messageIdCounter++}`;
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export const defaultMockPeople: Person[] = [
  {
    id: generatePersonId(),
    name: "Poorichaya Songsriboonsit",
    email: "businessconsultant297@itopplus.com",
    role: "Account Manager",
    company: "ITOPPLUS",
    label: "green",
    starred: true,
    unread: true,
    lastContact: "10:30 AM",
    snippet: "Here are the updated design specs for review.",
    messages: [
      {
        id: generateMessageId(),
        from: "Poorichaya Songsriboonsit",
        fromInitials: generateInitials("Poorichaya Songsriboonsit"),
        to: "me@example.com",
        subject: "Updated Design Specs",
        snippet: "Here are the updated design specs for review.",
        body: "Hi,\n\nI have attached the updated design specs for the new dashboard. Please review and let me know if any changes are needed.\n\nBest,\nPoorichaya",
        timestamp: "10:30 AM",
        unread: true,
        starred: true,
        label: "green",
      },
    ],
    social: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/ychrp?",
      linkedin: "https://linkedin.com/in/poorichaya-songsriboonsit",
    },
  },
  {
    id: generatePersonId(),
    name: "Nuttikarn Rodthong",
    email: "service19@itopplus.com",
    role: "Digital Marketing Consultant",
    company: "ITOPPLUS",
    label: "blue",
    starred: true,
    unread: true,
    lastContact: "10:30 AM",
    snippet: "Here are the updated design specs for review.",
    messages: [
      {
        id: generateMessageId(),
        from: "Nuttikarn Rodthong",
        fromInitials: generateInitials("Nuttikarn Rodthong"),
        to: "me@example.com",
        subject: "Marketing Campaign Report",
        snippet: "Q2 marketing performance metrics attached.",
        body: "Hi,\n\nPlease find attached the Q2 marketing campaign performance report. Let me know if you need any additional data.\n\nBest,\nNuttikarn",
        timestamp: "9:15 AM",
        unread: true,
        starred: true,
        label: "blue",
      },
    ],
    social: {
      facebook: "https://facebook.com/nuttikarn.r",
      instagram: "https://instagram.com/nuttikarn.r",
    },
  },
  {
    id: generatePersonId(),
    name: "Nuttanun Kaewkarn",
    email: "nuttanun@theiconweb.com",
    role: "Human Resource",
    company: "ITOPPLUS",
    label: "red",
    starred: false,
    unread: false,
    lastContact: "May 15",
    snippet: "Project timeline update needed.",
    messages: [
      {
        id: generateMessageId(),
        from: "Nuttanun Kaewkarn",
        fromInitials: generateInitials("Nuttanun Kaewkarn"),
        to: "me@example.com",
        subject: "Project Timeline Update",
        snippet: "Please review the revised timeline.",
        body: "Hi,\n\nWe need to adjust the project timeline due to some delays. Please review the attached schedule.\n\nBest,\nNuttanun",
        timestamp: "May 15",
        unread: false,
        starred: false,
        label: "red",
      },
    ],
    social: {
      facebook: "https://facebook.com/sarah.j",
      linkedin: "https://linkedin.com/in/sarah-johnson",
    },
  },
  {
    id: generatePersonId(),
    name: "Luxsamon Anuntaprayoon",
    email: "luxsamon@plusventure.co.th",
    role: "CEO",
    company: "StartupIO",
    label: "yellow",
    starred: true,
    unread: true,
    lastContact: "May 19",
    snippet: "Investment proposal ready for review.",
    messages: [
      {
        id: generateMessageId(),
        from: "Luxsamon Anuntaprayoon",
        fromInitials: generateInitials("Luxsamon Anuntaprayoon"),
        to: "me@example.com",
        subject: "Investment Proposal",
        snippet: "Our team has prepared the proposal.",
        body: "Hi,\n\nOur team has prepared the investment proposal as discussed. Let me know when you're available for a call.\n\nBest,\nMichael",
        timestamp: "May 19",
        unread: true,
        starred: true,
        label: "yellow",
      },
      {
        id: generateMessageId(),
        from: "Luxsamon Anuntaprayoon",
        fromInitials: generateInitials("Luxsamon Anuntaprayoon"),
        to: "me@example.com",
        subject: "Follow-up: Investment Proposal",
        snippet: "Any updates on the proposal review?",
        body: "Hi,\n\nJust following up on the investment proposal we sent last week. Do you have any questions?\n\nBest,\nMichael",
        timestamp: "May 20",
        unread: false,
        starred: false,
        label: "yellow",
      },
    ],
    social: {
      instagram: "https://www.instagram.com/ninglsmm?",
    },
  },
  {
    id: generatePersonId(),
    name: "Emma Williams",
    email: "emma.w@hr-corp.com",
    role: "HR Director",
    company: "HR Corp",
    label: "red",
    starred: false,
    unread: true,
    lastContact: "May 20",
    snippet: "New hiring policy announcement.",
    messages: [
      {
        id: generateMessageId(),
        from: "Emma Williams",
        fromInitials: generateInitials("Emma Williams"),
        to: "me@example.com",
        subject: "New Hiring Policy",
        snippet: "Please review the updated policy.",
        body: "Hi,\n\nWe've updated our hiring policy to streamline the recruitment process. Please review the attached document.\n\nBest,\nEmma",
        timestamp: "May 20",
        unread: true,
        starred: false,
        label: "red",
      },
    ],
    social: {
      linkedin: "https://linkedin.com/in/emma-williams",
    },
  },
  {
    id: generatePersonId(),
    name: "David Kim",
    email: "david.kim@ex-tech.com",
    role: "CTO",
    company: "EX Tech",
    label: "purple",
    starred: false,
    unread: false,
    lastContact: "May 14",
    snippet: "Technical architecture review.",
    messages: [
      {
        id: generateMessageId(),
        from: "David Kim",
        fromInitials: generateInitials("David Kim"),
        to: "me@example.com",
        subject: "Architecture Review",
        snippet: "Review the new system architecture.",
        body: "Hi,\n\nOur team has designed a new system architecture. Please review and provide feedback.\n\nBest,\nDavid",
        timestamp: "May 14",
        unread: false,
        starred: false,
        label: "purple",
      },
    ],
    social: {
      linkedin: "https://linkedin.com/in/david-kim",
    },
  },
];

function loadFromStorage(): Person[] {
  try {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== DATA_VERSION) {
      localStorage.setItem(STORAGE_VERSION_KEY, DATA_VERSION);
      localStorage.removeItem(STORAGE_KEY);
      return defaultMockPeople;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load from localStorage:", e);
  }
  return defaultMockPeople;
}

function saveToStorage(people: Person[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}

export const mockPeople = loadFromStorage();

export const getAllMessages = (): Message[] => {
  return mockPeople.flatMap((person: Person) => person.messages);
};

export const getDraftMessages = (): Message[] => {
  const me = mockPeople.find((person: Person) => person.email === "me@example.com");
  return me ? me.messages : [];
};

export function addMessageToPerson(message: Message, personEmail: string = "me@example.com"): void {
  const person = mockPeople.find((p: Person) => p.email === personEmail);
  if (person) {
    person.messages.push(message);
    saveToStorage(mockPeople);
  }
}

export function addPerson(person: Person): void {
  mockPeople.push(person);
  saveToStorage(mockPeople);
}

export function updatePerson(id: string, updates: Partial<Person>): void {
  const person = mockPeople.find((p: Person) => p.id === id);
  if (person) {
    Object.assign(person, updates);
    saveToStorage(mockPeople);
  }
}

export function deletePerson(id: string): void {
  const index = mockPeople.findIndex((p: Person) => p.id === id);
  if (index !== -1) {
    mockPeople.splice(index, 1);
    saveToStorage(mockPeople);
  }
}

export const defaultMockSnoozedMessages: Message[] = [
  {
    id: generateMessageId(),
    from: "Grace Liu",
    fromInitials: generateInitials("Grace Liu"),
    to: "me@example.com",
    subject: "Budget Review Meeting",
    snippet: "Rescheduled for next Monday at 2 PM.",
    body: "The budget review meeting has been rescheduled. Please update your calendar accordingly.",
    timestamp: "Tomorrow",
    unread: false,
    starred: false,
    label: "yellow",
  },
  {
    id: generateMessageId(),
    from: "Henry Wang",
    fromInitials: generateInitials("Henry Wang"),
    to: "me@example.com",
    subject: "Performance Review",
    snippet: "Q2 review scheduled for next week.",
    body: "Your Q2 performance review is scheduled for next Thursday. Please prepare your self-assessment.",
    timestamp: "May 20",
    unread: false,
    starred: false,
    label: "red",
  },
];

const SNOOZED_STORAGE_KEY = "moddb_snoozed";

function loadSnoozedFromStorage(): Message[] {
  try {
    const stored = localStorage.getItem(SNOOZED_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load snoozed from localStorage:", e);
  }
  return defaultMockSnoozedMessages;
}

function saveSnoozedToStorage(messages: Message[]): void {
  try {
    localStorage.setItem(SNOOZED_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save snoozed to localStorage:", e);
  }
}

export const mockSnoozedMessages = loadSnoozedFromStorage();

export function addSnoozedMessage(message: Message): void {
  mockSnoozedMessages.push(message);
  saveSnoozedToStorage(mockSnoozedMessages);
}

export function deleteSnoozedMessage(id: string): void {
  const index = mockSnoozedMessages.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockSnoozedMessages.splice(index, 1);
    saveSnoozedToStorage(mockSnoozedMessages);
  }
}

export function resetToDefaultData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SNOOZED_STORAGE_KEY);
  location.reload();
}
