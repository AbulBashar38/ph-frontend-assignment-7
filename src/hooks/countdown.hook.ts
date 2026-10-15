import { useEffect, useState } from "react";

// Seconds left until something is allowed again (e.g. resending an OTP); restart() starts it over
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return { remaining, restart: () => setRemaining(seconds) };
}
