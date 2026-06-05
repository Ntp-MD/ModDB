import { ref } from 'vue'
import { supabase, MY_EMAIL } from './supabase'
import type { Person, Message } from './types'

let personIdCounter = 1
let messageIdCounter = 1

export const defaultLabelMap: Record<string, string> = {
  blue: "DMS",
  yellow: "PlusVenture",
  green: "Sales",
  red: "HR",
  purple: "EX",
}

export async function loadLabelsFromDB(): Promise<{ id: string; label: string; color: string; is_preset: boolean }[]> {
  try {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading labels from database:', error);
    return [];
  }
}

export function getLabelMap(): Record<string, string> {
  try {
    const saved = localStorage.getItem("labelMap");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading label map:", error);
  }
  return { ...defaultLabelMap };
}

export function saveLabelMap(labelMap: Record<string, string>): void {
  localStorage.setItem("labelMap", JSON.stringify(labelMap));
}

export async function saveLabelMapToDB(labelMap: Record<string, string>): Promise<void> {
  try {
    for (const [id, label] of Object.entries(labelMap)) {
      const { error } = await supabase
        .from('labels')
        .update({ label, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('is_preset', true);

      if (error) console.error('Error updating label in database:', error);
    }
  } catch (error) {
    console.error('Error saving label map to database:', error);
  }
}

export function getCustomLabels(): { id: string; label: string; color: string }[] {
  try {
    const saved = localStorage.getItem("customLabels");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading custom labels:", error);
  }
  return [];
}

export async function saveCustomLabelsToDB(customLabels: { id: string; label: string; color: string }[]): Promise<void> {
  try {
    for (const customLabel of customLabels) {
      const { data: existing } = await supabase
        .from('labels')
        .select('id')
        .eq('id', customLabel.id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('labels')
          .update({ 
            label: customLabel.label, 
            color: customLabel.color,
            updated_at: new Date().toISOString() 
          })
          .eq('id', customLabel.id);

        if (error) console.error('Error updating custom label in database:', error);
      } else {
        const { error } = await supabase
          .from('labels')
          .insert({
            id: customLabel.id,
            label: customLabel.label,
            color: customLabel.color,
            is_preset: false,
          });

        if (error) console.error('Error inserting custom label to database:', error);
      }
    }
  } catch (error) {
    console.error('Error saving custom labels to database:', error);
  }
}

export async function deleteLabelFromDB(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id)
      .eq('is_preset', false);

    if (error) console.error('Error deleting label from database:', error);
  } catch (error) {
    console.error('Error deleting label from database:', error);
  }
}

export function getLabelText(label: string): string {
  const customLabel = customLabels.value.find(l => l.id === label);
  if (customLabel) {
    return customLabel.label;
  }
  return labelMap.value[label] || "Personal"
}

export function getLabelColor(label: string): string {
  const presetColors = ["blue", "yellow", "green", "red", "purple"];
  if (presetColors.includes(label)) {
    return `var(--label-${label})`;
  }
  const customLabel = customLabels.value.find(l => l.id === label);
  if (customLabel) {
    return customLabel.color;
  }
  return `var(--label-blue)`;
}

export function getAllLabels(): { id: string; label: string; color: string }[] {
  const presetLabels = Object.entries(labelMap.value).map(([id, label]) => ({
    id,
    label,
    color: id,
  }));
  return [...presetLabels, ...customLabels.value];
}

export async function generatePersonId(): Promise<string> {
  try {
    // Query database to get all person IDs to calculate max counter safely (avoiding alphabetical string sort issue)
    const { data, error } = await supabase
      .from('people')
      .select('id');

    if (error) {
      console.error('Error fetching person IDs:', error);
      return `person_${personIdCounter++}`;
    }

    let maxCounter = 0;
    if (data && data.length > 0) {
      for (const row of data) {
        const match = row.id.match(/^person_(\d+)$/);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val > maxCounter) {
            maxCounter = val;
          }
        }
      }
    }

    if (maxCounter >= personIdCounter) {
      personIdCounter = maxCounter + 1;
    }

    return `person_${personIdCounter++}`;
  } catch (error) {
    console.error('Error in generatePersonId:', error);
    return `person_${personIdCounter++}`;
  }
}

export async function generateMessageId(): Promise<string> {
  try {
    // Query database to get all message IDs to calculate max counter safely
    const { data, error } = await supabase
      .from('messages')
      .select('id');

    if (error) {
      console.error('Error fetching message IDs:', error);
      return `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    let maxCounter = 0;
    if (data && data.length > 0) {
      for (const row of data) {
        const match = row.id.match(/^msg_(\d+)$/);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val > maxCounter) {
            maxCounter = val;
          }
        }
      }
    }

    if (maxCounter >= messageIdCounter) {
      messageIdCounter = maxCounter + 1;
    }

    return `msg_${messageIdCounter++}`;
  } catch (error) {
    console.error('Error in generateMessageId:', error);
    return `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}

export function generateInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
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
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
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
        // If duplicate key error, generate new ID and retry
        if (error.code === '23505' && error.message.includes('people_pkey')) {
          console.warn('Duplicate ID detected, generating new ID and retrying...');
          person.id = await generatePersonId();
          retries++;
          continue;
        }
        console.error('addPerson: Supabase error:', error);
        throw error
      }

      // Success - break out of retry loop
      break;

    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error;
      }
      retries++;
    }
  }

  // Auto-create initial message for the new contact
  const messageId = await generateMessageId();
  const now = new Date();
  const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const { error: messageError } = await supabase
    .from('messages')
    .insert({
      id: messageId,
      person_id: person.id,
      msg_from: person.name,
      from_initials: generateInitials(person.name),
      msg_to: MY_EMAIL,
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
    
    // Fetch fresh person data from DB to avoid stale cache issues
    const { data: existing } = await supabase
      .from('people')
      .select('*')
      .eq('id', id)
      .single();
    
    const existingSocial = existing?.social && typeof existing.social === 'object' ? existing.social : {};
    const newStatus = status !== undefined ? status : (existingSocial?.status || 'inbox');
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
      const hasMessage = cachedMessages.value.some(m => m.person_id === id);
      if (!hasMessage) {
        const personName = name || existing?.name || 'Contact';
        const messageId = await generateMessageId();
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        await supabase
          .from('messages')
          .insert({
            id: messageId,
            person_id: id,
            msg_from: personName,
            from_initials: generateInitials(personName),
            msg_to: MY_EMAIL,
            subject: `New contact: ${personName}`,
            snippet: updates.snippet || existing?.snippet || `Added ${personName}`,
            body: `Hi,\n\nI've added ${personName} to my contacts.\n\nBest regards`,
            timestamp: timestamp,
            unread: true,
            starred: false,
            label: label || existing?.label || 'blue'
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
export const mockPeople = ref<Person[]>([])
export const cachedMessages = ref<Message[]>([])
export const customLabels = ref<{ id: string; label: string; color: string }[]>([])
export const labelMap = ref<Record<string, string>>({})

async function loadAllData(): Promise<void> {
  const [people, messages, labelsFromDB] = await Promise.all([
    loadPeople(),
    getAllMessages(),
    loadLabelsFromDB(),
  ])

  mockPeople.value = people
  cachedMessages.value = messages

  if (labelsFromDB && labelsFromDB.length > 0) {
    const custom: { id: string; label: string; color: string }[] = []
    const presets: Record<string, string> = { ...defaultLabelMap }

    labelsFromDB.forEach(l => {
      if (l.is_preset) {
        presets[l.id] = l.label
      } else {
        custom.push({ id: l.id, label: l.label, color: l.color })
      }
    })
    customLabels.value = custom
    labelMap.value = presets
    localStorage.setItem("customLabels", JSON.stringify(custom))
    localStorage.setItem("labelMap", JSON.stringify(presets))
  } else {
    customLabels.value = getCustomLabels()
    labelMap.value = getLabelMap()
  }
}

export async function initializeData(): Promise<void> {
  await loadAllData()
}

export function getPeople(): Person[] {
  return mockPeople.value
}

export function getCachedMessages(): Message[] {
  const personMap = new Map(mockPeople.value.map((p) => [p.id, p]));
  return cachedMessages.value.map((msg) => {
    const person = personMap.get(msg.person_id || "");
    return {
      ...msg,
      label: person?.label || msg.label,
    };
  });
}

export async function refreshData(): Promise<void> {
  await loadAllData()
}

export async function resetToDefaultData(): Promise<void> {
  try {
    await supabase.from('messages').delete().neq('id', '')
    await supabase.from('people').delete().neq('id', '')
    mockPeople.value = []
    cachedMessages.value = []
    window.location.reload()
  } catch (error) {
    console.error('Error resetting data:', error)
  }
}
