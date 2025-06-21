"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      color="#23F184"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="0 0 10px #6adca0,0 0 5px #6adca0"
      template='
        <div class="bar" role="progressbar" aria-label="Loading progress">
          <div class="peg"></div>
        </div>'
      zIndex={1600}
      showAtBottom={false}
    />
  );
} 