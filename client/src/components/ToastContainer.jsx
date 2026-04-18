import { useNotify } from "../context/NotificationContext";

function ToastContainer() {
  const context = useNotify();
  if (!context) return null;
  const { notifications, removeNotification } = context;

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {notifications.map((item) => (
        <button key={item.id} type="button" className={`toast-item ${item.tone}`} onClick={() => removeNotification(item.id)}>
          <span>{item.message}</span>
          <strong>×</strong>
        </button>
      ))}
    </div>
  );
}

export default ToastContainer;
