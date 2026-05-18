import { createContext, useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  const userRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
    roleRef.current = role;
  }, [user, role]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (!session?.user) {
        setUser(null);
        setRole(null);
        setName(null);
        setLoading(false);
        return;
      }
      if (
        (event === "SIGNED_IN" ||
          event === "INITIAL_SESSION" ||
          event === "TOKEN_REFRESHED") &&
        session.user
      ) {
        // onAuthStateChange runs even on browser tab change, so this way it avoids re-renders
        if (session?.user?.id === userRef.current?.id && roleRef.current) {
          return;
        }
        supabase
          .from("users")
          .select("role, name")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setName(data?.name ?? null);
            setUser(session?.user ?? null);
            setRole(data?.role ?? null);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user role:", error);
            setUser(session?.user ?? null);
            setRole(null);
            setLoading(false);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, name }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
