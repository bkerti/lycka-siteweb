import { useEffect, useRef } from 'react';

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useVersionChecker = () => {
  const currentVersion = useRef<string | null>(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/version.json', { cache: 'no-store' }); // Bypass browser cache
        if (!response.ok) {
          console.warn('Failed to fetch version.json, status:', response.status);
          return null;
        }
        const data = await response.json();
        return data.version;
      } catch (error) {
        console.error('Error fetching version.json:', error);
        return null;
      }
    };

    const checkAndUpdate = async () => {
      const latestVersion = await fetchVersion();

      if (latestVersion && !currentVersion.current) {
        // First fetch, set current version
        currentVersion.current = latestVersion;
      } else if (latestVersion && currentVersion.current && latestVersion !== currentVersion.current) {
        // New version detected, reload the page
        console.log('New version detected. Reloading page...');
        window.location.reload(true); // true forces reload from server, bypassing cache
      }
    };

    // Check immediately on mount
    checkAndUpdate();

    // Set up interval for periodic checks
    const intervalId = setInterval(checkAndUpdate, VERSION_CHECK_INTERVAL);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
};
