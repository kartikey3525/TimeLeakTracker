import { AppUsage } from '@native/usageStats';
import { getAppCategory, AppCategory } from './appCategories';

export type ProcessedApp = {
  packageName: string;
  totalTime: number;
  category: AppCategory;
};

export type UsageSummary = {
  apps: ProcessedApp[];
  totalTime: number;
  socialTime: number;
  productivityTime: number;
  productivityScore: number;
};

export const processUsageData = (data: AppUsage[]): UsageSummary => {
  if (!data || data.length === 0) {
    return {
      apps: [],
      totalTime: 0,
      socialTime: 0,
      productivityTime: 0,
      productivityScore: 0,
    };
  }

  const apps: ProcessedApp[] = data
    .filter(app => app.totalTime > 0)
    .map(app => ({
      packageName: app.packageName,
      totalTime: app.totalTime,
      category: getAppCategory(app.packageName),
    }));

  let totalTime = 0;
  let socialTime = 0;
  let productivityTime = 0;

  for (const app of apps) {
    totalTime += app.totalTime;

    if (app.category === 'social') {
      socialTime += app.totalTime;
    }

    if (app.category === 'productivity') {
      productivityTime += app.totalTime;
    }
  }

  const productivityScore =
    totalTime === 0 ? 0 : Math.round((productivityTime / totalTime) * 100);

  return {
    apps,
    totalTime,
    socialTime,
    productivityTime,
    productivityScore,
  };
};
