import { useCallback, useEffect, useState } from "react";
import { getStoredUser, me } from "../lib/auth";

export function useCurrentUser() {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(() => !getStoredUser());
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await me();
      setUser(result);
      if (!result) {
        setError("Session expired. Please sign in again.");
      }
    } catch (err) {
      setError(err?.message || "Failed to load user profile.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      refresh();
    }
  }, [refresh, user]);

  return { user, loading, error, refresh };
}
