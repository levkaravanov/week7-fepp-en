import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data?.error || "Signup failed";
        console.log(message);
        setError(message);
        setIsLoading(false);
        return { ok: false, error: message };
      }
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      return { ok: true, data };
    } catch (e) {
      const message = "Network error";
      console.log(message);
      setError(message);
      setIsLoading(false);
      return { ok: false, error: message };
    }
  };

  return { signup, isLoading, error };
}
