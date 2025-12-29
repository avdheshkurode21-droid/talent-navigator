-- Create interview_results table
CREATE TABLE public.interview_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  domain TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0,
  recommendation TEXT NOT NULL DEFAULT 'pending',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert results (for candidates taking the interview)
CREATE POLICY "Anyone can insert interview results"
ON public.interview_results
FOR INSERT
WITH CHECK (true);

-- Allow authenticated HR/admin users to view all results
CREATE POLICY "Authenticated users can view all results"
ON public.interview_results
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete results
CREATE POLICY "Authenticated users can delete results"
ON public.interview_results
FOR DELETE
USING (auth.uid() IS NOT NULL);