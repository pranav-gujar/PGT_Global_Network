-- SQL migration to set up the Database Trigger for Applications
-- This trigger automatically invokes the send-emails Edge Function upon new row insertions via pg_net.

-- 1. Ensure the pg_net extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create trigger function that executes the POST request to the Edge Function
CREATE OR REPLACE FUNCTION public.handle_new_application_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://fmylghoeosatqtqtmfki.supabase.co/functions/v1/send-emails',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Bind the trigger function to the applications table
DROP TRIGGER IF EXISTS tr_new_application_notification ON applications;
CREATE TRIGGER tr_new_application_notification
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_application_notification();
