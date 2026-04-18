import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);
let seed = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((message, tone = "success", timeout = 2800) => {
    const id = `${Date.now()}-${seed++}`;
    setNotifications((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => removeNotification(id), timeout);
  }, [removeNotification]);

  const value = useMemo(() => ({ notifications, notify, removeNotification }), [notifications, notify, removeNotification]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotify() {
  return useContext(NotificationContext);
}
