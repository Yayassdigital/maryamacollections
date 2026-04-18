import { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="install-popup">
      <div className="install-popup-content">
        <div>
          <h3>Install Our App</h3>
          <p>Install MARYAMA TURBANS for a faster mobile experience.</p>
        </div>

        <div className="install-actions">
          <button
            type="button"
            className="btn btn-outline small-btn"
            onClick={() => setShowInstall(false)}
          >
            Later
          </button>

          <button
            type="button"
            className="btn btn-primary small-btn"
            onClick={handleInstall}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;