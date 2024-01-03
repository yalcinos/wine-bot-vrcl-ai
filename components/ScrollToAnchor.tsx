"use client";

import * as React from "react";
import { useInView } from "react-intersection-observer";

import { useAtBottom } from "@/lib/hooks/use-scroll-bottom";

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
}

export function ScrollToAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();

  const { ref, entry, inView } = useInView({
    root: document as any,
    trackVisibility,
    threshold: 1,
    delay: 100,
    rootMargin: `${window.innerHeight * 0.6}px 0px`,
  });

  React.useEffect(() => {
    if (isAtBottom && trackVisibility && !inView) {
      entry?.target.scrollIntoView({ behavior: "smooth" });
    }
  }, [inView, entry, isAtBottom, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
