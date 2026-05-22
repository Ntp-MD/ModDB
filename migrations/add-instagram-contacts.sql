-- Add Instagram Contacts
-- Run this in Supabase SQL Editor

-- Insert people with Instagram contacts
INSERT INTO people (id, name, email, role, company, label, starred, unread, social) VALUES
(
  'person_phatphattra',
  'Phat Phattra',
  'phatphattra@instagram.com',
  'Social Media User',
  'Instagram',
  'blue',
  false,
  true,
  '{"instagram": "phatphattra", "status": "inbox"}'::jsonb
),
(
  'person_linffong',
  'Lin Fong',
  'linffong@instagram.com',
  'Social Media User',
  'Instagram',
  'blue',
  false,
  true,
  '{"instagram": "linffong", "status": "inbox"}'::jsonb
),
(
  'person_pakawarin',
  'Pakawarin',
  'pakawarin@instagram.com',
  'Social Media User',
  'Instagram',
  'blue',
  false,
  true,
  '{"instagram": "pakawarin_", "status": "inbox"}'::jsonb
),
(
  'person_ppopki',
  'Ppop Ki',
  'ppopki@instagram.com',
  'Social Media User',
  'Instagram',
  'blue',
  false,
  true,
  '{"instagram": "ppopki_", "status": "inbox"}'::jsonb
),
(
  'person_natchayar',
  'Natchayar',
  'natchayar@instagram.com',
  'Social Media User',
  'Instagram',
  'blue',
  false,
  true,
  '{"instagram": "natchayar", "status": "inbox"}'::jsonb
);

-- Insert messages for each contact
INSERT INTO messages (id, person_id, msg_from, from_initials, msg_to, subject, snippet, body, timestamp, unread, starred, label) VALUES
(
  'msg_phatphattra',
  'person_phatphattra',
  'Phat Phattra',
  'PP',
  'me@example.com',
  'Hello from Instagram - Phat Phattra',
  'New connection request from phatphattra',
  'Hi,

I came across your profile and wanted to connect. I''m Phat Phattra from Instagram.

Looking forward to connecting with you!

Best regards,
Phat Phattra',
  '10:00 AM',
  true,
  false,
  NULL
),
(
  'msg_linffong',
  'person_linffong',
  'Lin Fong',
  'LF',
  'me@example.com',
  'Hello from Instagram - Lin Fong',
  'New connection request from linffong',
  'Hi,

I came across your profile and wanted to connect. I''m Lin Fong from Instagram.

Looking forward to connecting with you!

Best regards,
Lin Fong',
  '10:05 AM',
  true,
  false,
  NULL
),
(
  'msg_pakawarin',
  'person_pakawarin',
  'Pakawarin',
  'P',
  'me@example.com',
  'Hello from Instagram - Pakawarin',
  'New connection request from pakawarin_',
  'Hi,

I came across your profile and wanted to connect. I''m Pakawarin from Instagram.

Looking forward to connecting with you!

Best regards,
Pakawarin',
  '10:10 AM',
  true,
  false,
  NULL
),
(
  'msg_ppopki',
  'person_ppopki',
  'Ppop Ki',
  'PK',
  'me@example.com',
  'Hello from Instagram - Ppop Ki',
  'New connection request from ppopki_',
  'Hi,

I came across your profile and wanted to connect. I''m Ppop Ki from Instagram.

Looking forward to connecting with you!

Best regards,
Ppop Ki',
  '10:15 AM',
  true,
  false,
  NULL
),
(
  'msg_natchayar',
  'person_natchayar',
  'Natchayar',
  'N',
  'me@example.com',
  'Hello from Instagram - Natchayar',
  'New connection request from natchayar',
  'Hi,

I came across your profile and wanted to connect. I''m Natchayar from Instagram.

Looking forward to connecting with you!

Best regards,
Natchayar',
  '10:20 AM',
  true,
  false,
  NULL
);
