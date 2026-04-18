import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("maryama_user");
    const savedToken = localStorage.getItem("maryama_token");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("maryama_user");
      }
    }

    if (savedToken) {
      setToken(savedToken);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !token) return;

    const syncMe = async () => {
      try {
        const data = await apiRequest("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("maryama_user", JSON.stringify(data.user));
        }
      } catch {
        setUser(null);
        setToken("");
        localStorage.removeItem("maryama_user");
        localStorage.removeItem("maryama_token");
      }
    };

    syncMe();
  }, [ready, token]);

  const persistAuth = (data) => {
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("maryama_user", JSON.stringify(data.user));
    }

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("maryama_token", data.token);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persistAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persistAuth(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return null;
    const data = await apiRequest("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("maryama_user", JSON.stringify(data.user));
    }
    return data.user || null;
  };

  const updateProfile = async (payload) => {
    const data = await apiRequest("/auth/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("maryama_user", JSON.stringify(data.user));
    }
    return data;
  };

  const changePassword = async (payload) => {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("maryama_user");
    localStorage.removeItem("maryama_token");
  };

  const value = {
    user,
    token,
    loading,
    ready,
    signup,
    login,
    logout,
    refreshProfile,
    updateProfile,
    changePassword,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
