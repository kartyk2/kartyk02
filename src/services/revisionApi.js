import { supabase } from "../lib/supabase";

export async function getSessions() {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .order("study_date", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createSession(session) {
  const { data, error } = await supabase
    .from("study_sessions")
    .insert([session])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getDueReviews() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study_sessions (
        id,
        title
      )
    `)
    .lte("due_date", today)
    .eq("completed", false);

  if (error) throw error;

  return data;
}

export async function completeReview(id) {
  const { error } = await supabase
    .from("revisions")
    .update({
      completed: true
    })
    .eq("id", id);

  if (error) throw error;
}