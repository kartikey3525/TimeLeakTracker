import { NativeModules } from 'react-native';

const { UsageStatsModule } = NativeModules;

export type UsageInterval = 'today' | 'yesterday';

export type AppUsage = {
  packageName: string;
  totalTime: number;
};

const getUsageStatsModule = () => {
  if (!UsageStatsModule) {
    throw new Error('UsageStatsModule is not linked on this platform.');
  }

  return UsageStatsModule;
};

export const getUsageStats = async (
  interval: UsageInterval,
): Promise<AppUsage[]> => {
  try {
    return await getUsageStatsModule().getUsageStats(interval);
  } catch {
    return [];
  }
};

export const openUsageAccessSettings = () => {
  try {
    getUsageStatsModule().openUsageAccessSettings();
  } catch {
    // Android-only native module; callers should keep the UX graceful.
  }
};

export const hasUsagePermission = async (): Promise<boolean> => {
  try {
    return await getUsageStatsModule().hasUsagePermission();
  } catch {
    return false;
  }
};
