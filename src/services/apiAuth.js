import { supabase } from "./supabase";

async function registerUser({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  const { error: userError } = await supabase.from("users").insert({
    id: data.user.id,
    name,
    role,
  });
  if (userError) {
    throw userError;
  }

  // Step 3 - Clear session so user must login manually
  await supabase.auth.signOut();

  return data;
}

async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  const id = data.user.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (userError) {
    throw userError;
  }
  return { ...data, role: userData.role };
}

async function signOut() {
  const {error} = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export { registerUser, login, signOut };
