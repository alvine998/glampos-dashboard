"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 350);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
