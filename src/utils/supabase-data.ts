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

// Supabase data functions
export async function loadPeople(): Promise<Person[]> {
  try {
    const { data: people, error: peopleError } = await supabase
      .from('people')
      .select('*')
      .order('created_at', { ascending: false })

    if (peopleError) throw peopleError

    if (!people || people.length === 0) {
      return []
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

        const socialObj = (person.social && typeof person.social === "object" ? person.social : {}) as Person["social"];
        return {
          ...person,
          status: socialObj?.status || "inbox",
          messages: messages || []
        }
      })
    )

    return peopleWithMessages
  } catch (error) {
    console.error('Error loading people:', error)
    return []
  }
}


export async function addPerson(person: Person): Promise<void> {
  try {
    const socialData = {
      ...(person.social || {}),
      status: person.status || "inbox"
    };

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
        unread: person.unread,
        social: socialData
      })

    if (error) {
      console.error('addPerson: Supabase error:', error);
      throw error
    }

    // Auto-create initial message for the new contact
    const messageId = generateMessageId();
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        id: messageId,
        person_id: person.id,
        msg_from: person.name,
        from_initials: generateInitials(person.name),
        msg_to: 'me@example.com',
        subject: `New contact: ${person.name}`,
        snippet: person.snippet || `Added ${person.name} from ${person.company}`,
        body: `Hi,\n\nI've added ${person.name} (${person.role} at ${person.company}) to my contacts.\n\nEmail: ${person.email}\n\nBest regards`,
        timestamp: timestamp,
        unread: true,
        starred: false,
        label: person.label
      });

    if (messageError) {
      console.error('addPerson: Failed to create initial message:', messageError);
      // Don't throw error - person was added successfully
    }
  } catch (error) {
    console.error('Error adding person:', error)
    throw error
  }
}

export async function updatePerson(id: string, updates: Partial<Person>): Promise<void> {
  try {
    const { name, email, role, company, label, starred, unread, status, social } = updates;
    const safeUpdates: Record<string, unknown> = {};
    if (name !== undefined) safeUpdates.name = name;
    if (email !== undefined) safeUpdates.email = email;
    if (role !== undefined) safeUpdates.role = role;
    if (company !== undefined) safeUpdates.company = company;
    if (label !== undefined) safeUpdates.label = label;
    if (starred !== undefined) safeUpdates.starred = starred;
    if (unread !== undefined) safeUpdates.unread = unread;
    
    // Merge social and status updates into JSONB social column
    const existingPerson = mockPeople.find(p => p.id === id);
    const existingSocial = existingPerson?.social && typeof existingPerson.social === 'object' ? existingPerson.social : {};
    const newStatus = status !== undefined ? status : (existingPerson?.status || 'inbox');
    const newSocial = social && typeof social === 'object' ? social : {};
    
    safeUpdates.social = {
      ...existingSocial,
      ...newSocial,
      status: newStatus
    };
    
    safeUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('people')
      .update(safeUpdates)
      .eq('id', id)

    if (error) {
      console.error('updatePerson: Supabase error:', error);
      throw error
    }

    // Auto-create initial message if contact is assigned to inbox and has no messages
    if (newStatus === 'inbox') {
      const hasMessage = cachedMessages.some(m => m.person_id === id);
      if (!hasMessage) {
        const personName = name || existingPerson?.name || 'Contact';
        const messageId = generateMessageId();
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        await supabase
          .from('messages')
          .insert({
            id: messageId,
            person_id: id,
            msg_from: personName,
            from_initials: generateInitials(personName),
            msg_to: 'me@example.com',
            subject: `New contact: ${personName}`,
            snippet: updates.snippet || existingPerson?.snippet || `Added ${personName}`,
            body: `Hi,\n\nI've added ${personName} to my contacts.\n\nBest regards`,
            timestamp: timestamp,
            unread: true,
            starred: false,
            label: label || existingPerson?.label || 'blue'
          });
      }
    }

  } catch (error) {
    console.error('Error updating person:', error)
    throw error
  }
}

export async function deletePerson(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('deletePerson: Supabase error:', error);
      throw error
    }
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
  const people = await loadPeople()
  const messages = await getAllMessages()
  mockPeople = people
  cachedMessages = messages
}

export function getPeople(): Person[] {
  return mockPeople
}

export function getCachedMessages(): Message[] {
  const personMap = new Map(mockPeople.map((p) => [p.id, p]));
  return cachedMessages.map((msg) => {
    const person = personMap.get(msg.person_id || "");
    return {
      ...msg,
      label: person?.label || msg.label,
    };
  });
}

export async function refreshData(): Promise<void> {
  mockPeople = await loadPeople()
  cachedMessages = await getAllMessages()
}

export async function resetToDefaultData(): Promise<void> {
  try {
    await supabase.from('messages').delete().neq('id', '')
    await supabase.from('people').delete().neq('id', '')
    mockPeople = []
    cachedMessages = []
    window.location.reload()
  } catch (error) {
    console.error('Error resetting data:', error)
  }
}

export { mockPeople }
