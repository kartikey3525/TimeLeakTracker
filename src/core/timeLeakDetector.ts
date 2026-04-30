import { UsageSummary } from './usageProcessor';

export type LeakLevel = 'safe' | 'warning' | 'high' | 'critical';

export type LeakResult = {
  level: LeakLevel;
  message: string;
  shouldTriggerFocus: boolean;
};

export const detectTimeLeak = (summary: UsageSummary): LeakResult => {
  const { totalTime, socialTime } = summary;

  if (totalTime === 0) {
    return {
      level: 'safe',
      message: 'No usage data yet.',
      shouldTriggerFocus: false,
    };
  }

  const socialRatio = socialTime / totalTime;

  // 🚨 CRITICAL
  if (totalTime > 4 * 60 * 60 * 1000 && socialRatio > 0.75) {
    return {
      level: 'critical',
      message: 'Severe time leak detected. Take control now.',
      shouldTriggerFocus: true,
    };
  }

  // 🔴 HIGH
  if (socialRatio > 0.75) {
    return {
      level: 'high',
      message: 'You are heavily distracted by social apps.',
      shouldTriggerFocus: true,
    };
  }

  // ⚠️ WARNING
  if (socialRatio > 0.6) {
    return {
      level: 'warning',
      message: 'Social usage is getting high. Stay mindful.',
      shouldTriggerFocus: false,
    };
  }

  // ✅ SAFE
  return {
    level: 'safe',
    message: 'Great balance! Keep it up.',
    shouldTriggerFocus: false,
  };
};
