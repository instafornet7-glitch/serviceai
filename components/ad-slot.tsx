"use client";

import { useEffect, useRef } from "react";
import { useSitePreferences } from "@/components/site-preferences-provider";
import type { AdPlacementId } from "@/lib/site-preferences";

declare global {
  interface Window {
    adsbygoogle?: Record<string, never>[];
  }
}

export function AdSlot({ id, className, description }: {
  id: AdPlacementId;
  className: string;
  description: string;
}) {
  const { preferences, adsenseReady } = useSitePreferences();
  const element = useRef<HTMLElement>(null);
  const initialized = useRef("");
  const slot = preferences.adSlots[id];
  const isConfigured = Boolean(preferences.adsenseClient && slot?.enabled && slot.slotId);
  const slotKey = isConfigured ? `${preferences.adsenseClient}/${slot.slotId}` : "";

  useEffect(() => {
    if (!isConfigured) {
      initialized.current = "";
      return;
    }
    if (!adsenseReady || initialized.current === slotKey || !element.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initialized.current = slotKey;
    } catch (error) {
      console.error(`Could not initialize AdSense placement "${id}":`, error);
    }
  }, [adsenseReady, id, isConfigured, slotKey]);

  return (
    <aside
      ref={element}
      className={`${className}${isConfigured ? " adsense-slot" : " ad-future-placeholder"}`}
      aria-label={isConfigured ? "إعلان" : "مساحة إعلانية مستقبلية"}
    >
      {isConfigured
        ? <ins
          key={slotKey}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={preferences.adsenseClient}
          data-ad-slot={slot.slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        : <><span>مساحة إعلانية مستقبلية</span><small>{description}</small></>}
    </aside>
  );
}
