import { NativeModules } from 'react-native';

const { UsageStatsModule } = NativeModules;

export const openUsageAccessSettings = () => {
  UsageStatsModule.openUsageAccessSettings();
};
