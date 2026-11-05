export {};

declare global {
  interface Window {
    textLoader?: { texts: unknown };
    applyAnaglyphEffect?: (intensity: number) => void;
    __modelTargets?: unknown;
  }
}
