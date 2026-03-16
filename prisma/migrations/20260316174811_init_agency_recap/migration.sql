-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'BUSINESS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('ZOOM', 'GOOGLE_MEET', 'TEAMS');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'PROCESSING', 'COMPLETED', 'FAILED', 'TOO_SHORT');

-- CreateEnum
CREATE TYPE "TranscriptStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "RecapStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionItemStatus" AS ENUM ('PENDING', 'PUSHED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'CONFIRMED', 'BOUNCED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('HUBSPOT', 'SALESFORCE', 'ZOOM', 'GOOGLE_MEET', 'TEAMS', 'ZAPIER');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('CONNECTED', 'DISCONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "TemplateTone" AS ENUM ('STANDARD', 'FORMAL', 'CASUAL');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "clerk_org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "brand_color" TEXT,
    "email_signature" TEXT,
    "custom_domain" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "plan_expires_at" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "org_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "avatar_url" TEXT,
    "confirmation_required" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "org_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT,
    "external_id" TEXT,
    "title" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "duration_seconds" INTEGER,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "bot_joined" BOOLEAN NOT NULL DEFAULT false,
    "recording_url" TEXT,
    "audio_file_path" TEXT,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_attendees" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meeting_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meeting_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcripts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "meeting_id" TEXT NOT NULL,
    "raw_text" TEXT NOT NULL,
    "processed_json" JSONB,
    "word_count" INTEGER,
    "language" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "speaker_segments" JSONB,
    "whisper_job_id" TEXT,
    "status" "TranscriptStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recaps" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "meeting_id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "generated_by_user_id" TEXT NOT NULL,
    "template_id" TEXT,
    "subject_line" TEXT NOT NULL,
    "opening_paragraph" TEXT NOT NULL,
    "decisions" JSONB,
    "next_steps" JSONB,
    "next_meeting_at" TIMESTAMP(3),
    "quality_score" INTEGER,
    "ai_model_version" TEXT,
    "status" "RecapStatus" NOT NULL DEFAULT 'DRAFT',
    "sent_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),
    "scheduled_send_at" TIMESTAMP(3),

    CONSTRAINT "recaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "action_items" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recap_id" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "owner_name" TEXT,
    "owner_email" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "crm_task_id" TEXT,
    "crm_pushed_at" TIMESTAMP(3),
    "status" "ActionItemStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "action_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recap_id" TEXT NOT NULL,
    "event_type" "EmailEventType" NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "postmark_message_id" TEXT,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recap_templates" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "tone" "TemplateTone" NOT NULL DEFAULT 'STANDARD',
    "subject_template" TEXT NOT NULL,
    "opening_template" TEXT NOT NULL,
    "sections_config" JSONB,
    "html_template" TEXT NOT NULL,

    CONSTRAINT "recap_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "org_id" TEXT NOT NULL,
    "user_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_clerk_org_id_key" ON "organizations"("clerk_org_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "organizations_clerk_org_id_idx" ON "organizations"("clerk_org_id");

-- CreateIndex
CREATE INDEX "organizations_deleted_at_idx" ON "organizations"("deleted_at");

-- CreateIndex
CREATE INDEX "organizations_plan_idx" ON "organizations"("plan");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_user_id_key" ON "users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "users_clerk_user_id_idx" ON "users"("clerk_user_id");

-- CreateIndex
CREATE INDEX "users_org_id_idx" ON "users"("org_id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "clients_org_id_idx" ON "clients"("org_id");

-- CreateIndex
CREATE INDEX "clients_email_idx" ON "clients"("email");

-- CreateIndex
CREATE INDEX "clients_deleted_at_idx" ON "clients"("deleted_at");

-- CreateIndex
CREATE INDEX "meetings_org_id_idx" ON "meetings"("org_id");

-- CreateIndex
CREATE INDEX "meetings_user_id_idx" ON "meetings"("user_id");

-- CreateIndex
CREATE INDEX "meetings_client_id_idx" ON "meetings"("client_id");

-- CreateIndex
CREATE INDEX "meetings_status_idx" ON "meetings"("status");

-- CreateIndex
CREATE INDEX "meetings_created_at_idx" ON "meetings"("created_at");

-- CreateIndex
CREATE INDEX "meetings_deleted_at_idx" ON "meetings"("deleted_at");

-- CreateIndex
CREATE INDEX "meetings_scheduled_at_idx" ON "meetings"("scheduled_at");

-- CreateIndex
CREATE INDEX "meeting_attendees_meeting_id_idx" ON "meeting_attendees"("meeting_id");

-- CreateIndex
CREATE INDEX "meeting_attendees_email_idx" ON "meeting_attendees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "transcripts_meeting_id_key" ON "transcripts"("meeting_id");

-- CreateIndex
CREATE INDEX "transcripts_meeting_id_idx" ON "transcripts"("meeting_id");

-- CreateIndex
CREATE INDEX "transcripts_status_idx" ON "transcripts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "recaps_meeting_id_key" ON "recaps"("meeting_id");

-- CreateIndex
CREATE INDEX "recaps_org_id_idx" ON "recaps"("org_id");

-- CreateIndex
CREATE INDEX "recaps_client_id_idx" ON "recaps"("client_id");

-- CreateIndex
CREATE INDEX "recaps_generated_by_user_id_idx" ON "recaps"("generated_by_user_id");

-- CreateIndex
CREATE INDEX "recaps_template_id_idx" ON "recaps"("template_id");

-- CreateIndex
CREATE INDEX "recaps_status_idx" ON "recaps"("status");

-- CreateIndex
CREATE INDEX "recaps_created_at_idx" ON "recaps"("created_at");

-- CreateIndex
CREATE INDEX "recaps_deleted_at_idx" ON "recaps"("deleted_at");

-- CreateIndex
CREATE INDEX "recaps_sent_at_idx" ON "recaps"("sent_at");

-- CreateIndex
CREATE INDEX "action_items_recap_id_idx" ON "action_items"("recap_id");

-- CreateIndex
CREATE INDEX "action_items_status_idx" ON "action_items"("status");

-- CreateIndex
CREATE INDEX "action_items_due_date_idx" ON "action_items"("due_date");

-- CreateIndex
CREATE INDEX "email_events_recap_id_idx" ON "email_events"("recap_id");

-- CreateIndex
CREATE INDEX "email_events_event_type_idx" ON "email_events"("event_type");

-- CreateIndex
CREATE INDEX "email_events_created_at_idx" ON "email_events"("created_at");

-- CreateIndex
CREATE INDEX "recap_templates_org_id_idx" ON "recap_templates"("org_id");

-- CreateIndex
CREATE INDEX "recap_templates_is_default_idx" ON "recap_templates"("is_default");

-- CreateIndex
CREATE INDEX "integrations_org_id_idx" ON "integrations"("org_id");

-- CreateIndex
CREATE INDEX "integrations_status_idx" ON "integrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_org_id_type_key" ON "integrations"("org_id", "type");

-- CreateIndex
CREATE INDEX "audit_logs_org_id_idx" ON "audit_logs"("org_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_attendees" ADD CONSTRAINT "meeting_attendees_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcripts" ADD CONSTRAINT "transcripts_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recaps" ADD CONSTRAINT "recaps_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recaps" ADD CONSTRAINT "recaps_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recaps" ADD CONSTRAINT "recaps_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recaps" ADD CONSTRAINT "recaps_generated_by_user_id_fkey" FOREIGN KEY ("generated_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recaps" ADD CONSTRAINT "recaps_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "recap_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_recap_id_fkey" FOREIGN KEY ("recap_id") REFERENCES "recaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_recap_id_fkey" FOREIGN KEY ("recap_id") REFERENCES "recaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recap_templates" ADD CONSTRAINT "recap_templates_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
