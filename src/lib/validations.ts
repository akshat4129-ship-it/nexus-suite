import { z } from 'zod';
import { Priority, TemplateTone, MeetingStatus } from '@prisma/client';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Clients
export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  timezone: z.string().optional(),
  confirmation_required: z.boolean().default(true),
});

export const updateClientSchema = createClientSchema.partial();

// Meetings
export const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  client_id: z.string().uuid().optional(),
  scheduled_at: z.string().datetime().optional(),
  platform: z.enum(['ZOOM', 'GOOGLE_MEET', 'TEAMS']).default('ZOOM'),
});

export const updateMeetingSchema = createMeetingSchema.partial().extend({
  status: z.nativeEnum(MeetingStatus).optional(),
});

// Recaps
export const updateRecapSchema = z.object({
  subject_line: z.string().optional(),
  opening_paragraph: z.string().optional(),
  next_meeting_at: z.string().datetime().optional().nullable(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENT', 'CONFIRMED', 'FAILED']).optional(),
});

export const scheduleRecapSchema = z.object({
    scheduled_send_at: z.string().datetime()
});

// Templates
export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  is_default: z.boolean().default(false),
  tone: z.nativeEnum(TemplateTone).default('STANDARD'),
  subject_template: z.string().min(1, "Subject template is required"),
  opening_template: z.string().min(1, "Opening template is required"),
  html_template: z.string().min(1, "HTML template is required"),
  sections_config: z.any().optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();
