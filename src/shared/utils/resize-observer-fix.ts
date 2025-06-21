export const fixResizeObserverError = () => {
  window.addEventListener("error", (e) => {
    if (
      e.message ===
        "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded"
    ) {
      const resizeObserverError = e;

      // Prevent the error from being logged to the console
      resizeObserverError.stopImmediatePropagation();
    }
  });
};
