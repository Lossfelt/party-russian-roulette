import { useEffect } from 'react';

interface WakeLockSentinel {
  release: () => Promise<void>;
  released: boolean;
}

interface WakeLockAPI {
  request: (type: 'screen') => Promise<WakeLockSentinel>;
}

export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (typeof navigator === 'undefined') return;
    const wl = (navigator as unknown as { wakeLock?: WakeLockAPI }).wakeLock;
    if (!wl) return;

    let sentinel: WakeLockSentinel | null = null;

    const acquire = async () => {
      try {
        sentinel = await wl.request('screen');
      } catch {
        sentinel = null;
      }
    };

    void acquire();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && (!sentinel || sentinel.released)) {
        void acquire();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (sentinel) {
        void sentinel.release().catch(() => {});
      }
    };
  }, [active]);
}
