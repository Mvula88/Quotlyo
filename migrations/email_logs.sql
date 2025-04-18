-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- e.g., 'invoice_reminder', 'payment_receipt', etc.
  recipient VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  related_id UUID, -- ID of the related entity (invoice, quotation, etc.)
  status VARCHAR(20) NOT NULL, -- 'sent', 'failed', etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on type and related_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_type_related_id ON email_logs(type, related_id);

-- Create index on recipient for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
