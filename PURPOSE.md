# ModDB - Contact Management System

## Purpose

ModDB is a contact management application designed to help you organize and manage your professional network. The application provides a Gmail-like interface that makes it feel natural to use during work hours, helping you stay productive while maintaining your contacts.

## Features

- **Contact Management**: Add, edit, and delete contacts with detailed information including name, email, role, company, and social media links
- **Label System**: Organize contacts with color-coded labels (DMS, PlusVenture, Sales, HR, EX) and create custom labels
- **Message Tracking**: Track conversations and interactions with each contact
- **Starred Contacts**: Mark important contacts for quick access
- **Draft Management**: Save draft messages for later
- **Search & Filter**: Quickly find contacts by name, email, role, or company
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Why Gmail-like Interface?

The Gmail-inspired design serves a practical purpose:

- **Familiar Workflow**: Most professionals are already comfortable with Gmail's interface, reducing learning curve
- **Work-Appropriate**: The clean, professional appearance looks like legitimate work software
- **Efficient Navigation**: Three-pane layout (sidebar, list, detail) enables quick access to information
- **Mobile-Friendly**: Responsive design ensures usability across all devices

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Pure CSS with CSS variables (no framework)
- **Routing**: Vue Router

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Privacy

All contact data is stored in your own Supabase instance. You have full control over your data and can reset it at any time through the "Compose" button in the sidebar.

## License

This is a personal project for contact management purposes.
