import { useEffect, useState } from "react";

/**
 * Re-render trigger when cloud sync updates localStorage.
 * Returns a version number that changes on each `ta-cloud-update` event.
 */
export function useCloudRefresh() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV((x) => x + 1);
    window.addEventListener("ta-cloud-update", bump);
    return () => window.removeEventListener("ta-cloud-update", bump);
  }, []);
  return v;
}
