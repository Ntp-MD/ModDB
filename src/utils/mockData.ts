import type { Person, Message } from "./types";

let personIdCounter = 1;
let messageIdCounter = 1;

const STORAGE_KEY = "moddb_people";

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
    label: "blue",
    labelText: "DMS",
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
        label: "blue",
        labelText: "DMS",
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
    labelText: "DMS",
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
        labelText: "DMS",
      },
    ],
    social: {
      facebook: "https://facebook.com/nuttikarn.r",
      instagram: "https://instagram.com/nuttikarn.r",
    },
  },
];

function loadFromStorage(): Person[] {
  try {
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
    labelText: "Plusventure",
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
    labelText: "HR",
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
