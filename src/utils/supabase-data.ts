import { supabase } from './supabase'
import type { Person, Message } from './types'

let personIdCounter = 1
let messageIdCounter = 1

const labelMap: Record<string, string> = {
  blue: "DMS",
  yellow: "PlusVenture",
  green: "Sales",
  red: "HR",
  purple: "EX",
}

export function getLabelText(label: string): string {
  return labelMap[label] || "Personal"
}

export function generatePersonId(): string {
  return `${personIdCounter++}`
}

export function generateMessageId(): string {
  return `msg_${messageIdCounter++}`
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Default data for initialization
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
        msg_from: "Poorichaya Songsriboonsit",
        from_initials: generateInitials("Poorichaya Songsriboonsit"),
        msg_to: "me@example.com",
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
        msg_from: "Nuttikarn Rodthong",
        from_initials: generateInitials("Nuttikarn Rodthong"),
        msg_to: "me@example.com",
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
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/ychrp?",
      linkedin: "https://linkedin.com/in/nuttikarn-rodthong",
    },
  },
  {
    id: generatePersonId(),
    name: "Nuttanun Kaewkarn",
    email: "service19@itopplus.com",
    role: "HR Manager",
    company: "ITOPPLUS",
    label: "red",
    starred: false,
    unread: false,
    lastContact: "May 15",
    snippet: "Please review the revised timeline.",
    messages: [
      {
        id: generateMessageId(),
        msg_from: "Nuttanun Kaewkarn",
        from_initials: generateInitials("Nuttanun Kaewkarn"),
        msg_to: "me@example.com",
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
        msg_from: "Luxsamon Anuntaprayoon",
        from_initials: generateInitials("Luxsamon Anuntaprayoon"),
        msg_to: "me@example.com",
        subject: "Investment Proposal",
        snippet: "Our team has prepared the proposal.",
        body: "Hi,\n\nOur team has prepared the investment proposal as discussed. Let me know when you're available for a call.\n\nBest,\nLuxsamon",
        timestamp: "May 19",
        unread: true,
        starred: true,
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
    email: "emma.williams@company.com",
    role: "Product Designer",
    company: "Design Studio",
    label: "red",
    starred: false,
    unread: false,
    lastContact: "May 10",
    snippet: "New UI concepts are ready.",
    messages: [
      {
        id: generateMessageId(),
        msg_from: "Emma Williams",
        from_initials: generateInitials("Emma Williams"),
        msg_to: "me@example.com",
        subject: "UI Design Updates",
        snippet: "New UI concepts are ready.",
        body: "Hi,\n\nI've completed the new UI concepts for the dashboard. Please review when you have time.\n\nBest,\nEmma",
        timestamp: "May 10",
        unread: false,
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
    email: "david.kim@techcorp.com",
    role: "Software Engineer",
    company: "TechCorp",
    label: "purple",
    starred: true,
    unread: false,
    lastContact: "May 8",
    snippet: "Code review completed.",
    messages: [
      {
        id: generateMessageId(),
        msg_from: "David Kim",
        from_initials: generateInitials("David Kim"),
        msg_to: "me@example.com",
        subject: "Code Review",
        snippet: "Code review completed.",
        body: "Hi,\n\nI've finished the code review for the latest changes. Everything looks good!\n\nBest,\nDavid",
        timestamp: "May 8",
        unread: false,
        starred: true,
        label: "purple",
      },
    ],
    social: {
      github: "https://github.com/davidkim",
      linkedin: "https://linkedin.com/in/david-kim",
    },
  },
]

// Supabase data functions
export async function loadPeople(): Promise<Person[]> {
  try {
    const { data: people, error: peopleError } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false })

    if (peopleError) throw peopleError

    if (!people || people.length === 0) {
      // Initialize with default data
      await initializeDefaultData()
      return defaultMockPeople
    }

    // Load messages for each person
    const peopleWithMessages = await Promise.all(
      people.map(async (person) => {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('person_id', person.id)
          .order('timestamp', { ascending: false })

        if (messagesError) throw messagesError

        return {
          ...person,
          messages: messages || []
        }
      })
    )

    return peopleWithMessages
  } catch (error) {
    console.error('Error loading people:', error)
    return defaultMockPeople
  }
}

export async function initializeDefaultData(): Promise<void> {
  try {
    // Insert people
    for (const person of defaultMockPeople) {
      const { error } = await supabase
        .from('people')
        .insert({
          id: person.id,
          name: person.name,
          email: person.email,
          role: person.role,
          company: person.company,
          label: person.label,
          starred: person.starred,
          unread: person.unread
        })

      if (error) throw error

      // Insert messages for this person
      for (const message of person.messages) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            id: message.id,
            person_id: person.id,
            msg_from: message.msg_from,
            from_initials: message.from_initials,
            msg_to: message.msg_to,
            subject: message.subject,
            snippet: message.snippet,
            body: message.body,
            timestamp: message.timestamp,
            unread: message.unread,
            starred: message.starred,
            label: message.label
          })

        if (messageError) throw messageError
      }
    }
  } catch (error) {
    console.error('Error initializing default data:', error)
  }
}

export async function addPerson(person: Person): Promise<void> {
  try {
    console.log('addPerson: Adding person', person.name);
    const { error } = await supabase
      .from('people')
      .insert({
        id: person.id,
        name: person.name,
        email: person.email,
        role: person.role,
        company: person.company,
        label: person.label,
        starred: person.starred,
        unread: person.unread
      })

    if (error) {
      console.error('addPerson: Supabase error:', error);
      throw error
    }
    console.log('addPerson: Success');
    mockPeople.push(person)
  } catch (error) {
    console.error('Error adding person:', error)
    throw error
  }
}

export async function updatePerson(id: string, updates: Partial<Person>): Promise<void> {
  try {
    console.log('updatePerson: Updating person', id, updates);
    const { name, email, role, company, label, starred, unread } = updates;
    const safeUpdates: Record<string, unknown> = {};
    if (name !== undefined) safeUpdates.name = name;
    if (email !== undefined) safeUpdates.email = email;
    if (role !== undefined) safeUpdates.role = role;
    if (company !== undefined) safeUpdates.company = company;
    if (label !== undefined) safeUpdates.label = label;
    if (starred !== undefined) safeUpdates.starred = starred;
    if (unread !== undefined) safeUpdates.unread = unread;
    safeUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('people')
      .update(safeUpdates)
      .eq('id', id)

    if (error) {
      console.error('updatePerson: Supabase error:', error);
      throw error
    }
    console.log('updatePerson: Success');
  } catch (error) {
    console.error('Error updating person:', error)
    throw error
  }
}

export async function deletePerson(id: string): Promise<void> {
  try {
    console.log('deletePerson: Deleting person', id);
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('deletePerson: Supabase error:', error);
      throw error
    }
    console.log('deletePerson: Success');
  } catch (error) {
    console.error('Error deleting person:', error)
    throw error
  }
}

export async function getAllMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting all messages:', error)
    return []
  }
}

// Reactive data store with caching
let mockPeople: Person[] = []
let cachedMessages: Message[] = []

export async function initializeData(): Promise<void> {
  console.log('initializeData: Starting...')
  const people = await loadPeople()
  console.log('initializeData: Loaded', people.length, 'people')
  
  const messages = await getAllMessages()
  console.log('initializeData: Loaded', messages.length, 'messages')
  
  // If database is empty (no people OR no messages), initialize default data
  if (people.length === 0 || messages.length === 0) {
    console.log('Database is empty (no people or no messages), initializing default data...')
    await initializeDefaultData()
    mockPeople = await loadPeople()
    console.log('initializeData: After initialization, loaded', mockPeople.length, 'people')
  } else {
    mockPeople = people
  }
  
  cachedMessages = await getAllMessages()
  console.log('initializeData: Final messages count:', cachedMessages.length)
  console.log('initializeData: Complete')
}

export function getPeople(): Person[] {
  return mockPeople
}

export function getCachedMessages(): Message[] {
  return cachedMessages
}

export async function refreshData(): Promise<void> {
  mockPeople = await loadPeople()
  cachedMessages = await getAllMessages()
}

export async function resetToDefaultData(): Promise<void> {
  try {
    await supabase.from('messages').delete().neq('id', '')
    await supabase.from('people').delete().neq('id', '')
    await initializeDefaultData()
    mockPeople = await loadPeople()
    cachedMessages = await getAllMessages()
    window.location.reload()
  } catch (error) {
    console.error('Error resetting data:', error)
  }
}

export { mockPeople }
