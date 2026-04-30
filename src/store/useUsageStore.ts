import { create } from 'zustand';
import { getUsageStats } from '../native/usageStats'; // safer than alias for now
import { processUsageData, UsageSummary } from '../core/usageProcessor';
import { detectTimeLeak, LeakResult } from '../core/timeLeakDetector';

type UsageState = {
  summary: UsageSummary;
  leak: LeakResult | null; // ✅ added
  loading: boolean;
  error: string | null;

  fetchUsage: () => Promise<UsageSummary | null>; // ✅ typed return
};

export const useUsageStore = create<UsageState>(set => ({
  summary: {
    apps: [],
    totalTime: 0,
    socialTime: 0,
    productivityTime: 0,
    productivityScore: 0,
  },

  leak: null, // ✅ added

  loading: false,
  error: null,

  fetchUsage: async () => {
    try {
      set({ loading: true, error: null });

      const rawData = await getUsageStats('today');

      const processed = processUsageData(rawData);

      // ✅ STEP 6 CORE LOGIC
      const leak = detectTimeLeak(processed);

      set({
        summary: processed,
        leak: leak, // ✅ store leak result
        loading: false,
      });

      return processed;
    } catch (e: any) {
      set({
        error: e?.message || 'Failed to fetch usage',
        loading: false,
      });

      return null;
    }
  },
}));
