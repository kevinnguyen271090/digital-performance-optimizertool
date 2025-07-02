import { useState, useEffect, useCallback, useMemo } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { fetchAllPlatformData, DashboardMetrics } from "../utils/platformDataService";
import { PlatformConnection } from "../types/dashboard";

export const useDashboardData = (session: Session | null) => {
  const [realData, setRealData] = useState<DashboardMetrics>({});
  const [loading, setLoading] = useState(true);
  const [hasConnectedPlatforms, setHasConnectedPlatforms] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<PlatformConnection[]>([]);
  const [platformData, setPlatformData] = useState<{[key: string]: any}>({});

  const fetchConnectionData = useCallback(async () => {
    if (!session?.user) {
      setHasConnectedPlatforms(false);
      setConnectedPlatforms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch connections from Supabase, mirroring the query from Settings.tsx
      // We remove the status filter to debug a potential RLS issue.
      const { data: connections, error } = await supabase
        .from('connections')
        .select('platform, status, updated_at, metadata, account_details, last_connected, last_sync')
        .eq('user_id', session.user.id);
        // .eq('status', 'connected'); // Temporarily removed for debugging

      if (error) {
        console.error('Error fetching connections:', error);
        throw error;
      }
      
      // Filter for connected platforms on the client-side
      const connected = connections?.filter(c => c.status === 'connected') || [];

      if (connected && connected.length > 0) {
        setHasConnectedPlatforms(true);
        const platformConnections: PlatformConnection[] = connected.map(c => ({
          platform: c.platform,
          status: c.status as 'connected' | 'available' | 'error',
          lastSync: new Date(c.updated_at),
        }));
        setConnectedPlatforms(platformConnections);

        // Fetch detailed data for connected platforms
        const data = await fetchAllPlatformData(session.user.id);
        setRealData(data);
        setPlatformData(data); // Assuming fetchAllPlatformData returns the structure needed
      } else {
        setHasConnectedPlatforms(false);
        setConnectedPlatforms([]);
        setRealData({});
        setPlatformData({});
      }
    } catch (error) {
      console.error('Error in fetchConnectionData:', error);
      setHasConnectedPlatforms(false);
      setConnectedPlatforms([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Memoize expensive calculations
  const memoizedPlatformData = useMemo(() => platformData, [platformData]);
  const memoizedConnectedPlatforms = useMemo(() => connectedPlatforms, [connectedPlatforms]);

  useEffect(() => {
    fetchConnectionData();
  }, [fetchConnectionData]);

  return {
    realData,
    loading,
    hasConnectedPlatforms,
    connectedPlatforms: memoizedConnectedPlatforms,
    platformData: memoizedPlatformData
  };
}; 