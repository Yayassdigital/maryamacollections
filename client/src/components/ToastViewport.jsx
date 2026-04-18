import { useToast } from "../context/ToastContext";

function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card ${toast.tone}`}>
          <div>
            <strong>{toast.tone === "success" ? "Success" : toast.tone === "error" ? "Attention" : toast.tone === "warning" ? "Notice" : "Update"}</strong>
            <p>{toast.message}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
