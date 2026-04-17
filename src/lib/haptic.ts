let enabled = true;

function vibrate(pattern: number | number[]) {
  if (!enabled) return;
  if (typeof navigator === 'undefined') return;
  if (typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw on unsupported patterns; ignore.
  }
}

export const haptic = {
  setEnabled(v: boolean) {
    enabled = v;
  },
  light: () => vibrate(10),
  medium: () => vibrate(25),
  heavy: () => vibrate([50, 30, 90]),
  success: () => vibrate([30, 60, 30, 60, 40]),
  tick: () => vibrate(5),
};
