"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setVisible(false);
    toast.success("Vos préférences de cookies ont été enregistrées.");
  };

  const acceptAll = () => {
    const all = { essential: true, analytics: true, marketing: true };
    savePreferences(all);
  };

  const refuseAll = () => {
    const refused = { essential: true, analytics: false, marketing: false };
    savePreferences(refused);
    toast("Seuls les cookies essentiels sont activés.");
  };

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // toujours actif
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="cookie-banner"
          role="dialog"
          aria-live="polite"
        >
          {!showSettings ? (
            <>
              <p className="text-sm text-center md:text-left">
                Nous utilisons des cookies pour garantir le bon fonctionnement
                du site et améliorer votre expérience. Vous pouvez accepter,
                refuser ou personnaliser vos choix.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full mt-2">
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  className="bg-muted text-foreground hover:bg-muted/80 transition"
                >
                  Personnaliser
                </Button>
                <Button
                  onClick={refuseAll}
                  variant="outline"
                  className="bg-muted text-foreground hover:bg-muted/80 transition"
                >
                  Refuser
                </Button>
                <Button
                  onClick={acceptAll}
                  className="bg-primary text-foreground hover:brightness-110 transition"
                >
                  Tout accepter
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold mb-2 text-center md:text-left">
                Préférences de cookies
              </h3>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <label className="flex justify-between items-center border-b border-[var(--border)] py-2">
                  <span>Essentiels (toujours actifs)</span>
                  <input type="checkbox" checked disabled />
                </label>

                <label className="flex justify-between items-center border-b border-[var(--border)] py-2">
                  <span>Statistiques anonymes</span>
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={() => handleToggle("analytics")}
                  />
                </label>

                <label className="flex justify-between items-center py-2">
                  <span>Marketing / Réseaux sociaux</span>
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={() => handleToggle("marketing")}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="bg-muted text-foreground hover:bg-muted/80 transition"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => savePreferences(prefs)}
                  className="bg-primary text-foreground hover:brightness-110 transition"
                >
                  Enregistrer
                </Button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
