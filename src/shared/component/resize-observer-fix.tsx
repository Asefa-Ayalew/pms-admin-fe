"use client";

import { useEffect } from "react";
import { fixResizeObserverError } from "../utils/resize-observer-fix";

export function ResizeObserverFix() {
  useEffect(() => {
    fixResizeObserverError();
  }, []);

  return null;
}
