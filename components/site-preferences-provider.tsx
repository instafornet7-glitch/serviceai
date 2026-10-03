"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createDefaultSitePreferences, parseSitePreferences, type SitePreferences } from "@/lib/site-preferences";

type PreferencesContextValue = {
  preferences: SitePreferences;
  adsenseReady: boolean;
};

const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: createDefaultSitePreferences(),
  adsenseReady: false,
});

export function useSitePreferences() {
  return useContext(PreferencesContext);
}

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState(createDefaultSitePreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [readyPublisherId, setReadyPublisherId] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/site-preferences", { cache: "no-store" });
        if (!response.ok) throw new Error(`Site preferences request failed (${response.status}).`);
        const data: unknown = await response.json();
        setPreferences(
          typeof data === "object" && data !== null && !Array.isArray(data)
            ? parseSitePreferences(data as Record<string, unknown>)
            : createDefaultSitePreferences(),
        );
        setPreferencesLoaded(true);
      } catch (error) {
        console.error("Could not load public site preferences:", error);
      }
    };
    const onSettingsUpdated = () => { void loadPreferences(); };
    void loadPreferences();
    window.addEventListener("site-preferences-updated", onSettingsUpdated);

    return () => window.removeEventListener("site-preferences-updated", onSettingsUpdated);
  }, []);

  useEffect(() => {
    const metaName = "google-adsense-account";
    const existingMeta = document.head.querySelector<HTMLMetaElement>(`meta[name="${metaName}"]`);

    if (!preferencesLoaded && !preferences.adsenseClient) return;

    if (!preferences.adsenseClient) {
      existingMeta?.remove();
      return;
    }

    const meta = existingMeta ?? document.createElement("meta");
    meta.name = metaName;
    meta.content = preferences.adsenseClient;
    if (!existingMeta) document.head.append(meta);

    return () => {
      if (meta.content === preferences.adsenseClient) meta.remove();
    };
  }, [preferences.adsenseClient, preferencesLoaded]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--blue", preferences.branding.primaryColor);
    root.style.setProperty("--blue-dark", preferences.branding.primaryColor);
    root.style.setProperty("--green", preferences.branding.accentColor);
  }, [preferences.branding.primaryColor, preferences.branding.accentColor]);

  const shouldLoadAds = Boolean(
    preferences.adsenseClient
    && Object.values(preferences.adSlots).some((slot) => slot.enabled && slot.slotId),
  );

  useEffect(() => {
    const scriptId = "google-adsense-script";
    const existingScript = document.head.querySelector<HTMLScriptElement>(`#${scriptId}`);

    if (!shouldLoadAds || !preferences.adsenseClient) return;

    const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(preferences.adsenseClient)}`;
    if (existingScript?.src === scriptSrc) return;
    existingScript?.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = scriptSrc;
    script.onload = () => setReadyPublisherId(preferences.adsenseClient);
    script.onerror = () => {
      setReadyPublisherId("");
      console.error("Google AdSense script failed to load.");
    };
    document.head.append(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [preferences.adsenseClient, shouldLoadAds]);

  return (
    <PreferencesContext.Provider value={{
      preferences,
      adsenseReady: shouldLoadAds && readyPublisherId === preferences.adsenseClient,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}
