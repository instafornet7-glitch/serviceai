"use client";

import { useEffect, useRef, useState } from "react";
import { get, subscribe } from "@/lib/localDB";

export function useLocalDBValue<T>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);
  const fallbackRef = useRef(fallback);
  useEffect(() => {
    const refresh = () => setValue(get(key, fallbackRef.current));
    refresh();
    return subscribe((changedKey) => {
      if (changedKey === key) refresh();
    });
  }, [key]);
  return value;
}
