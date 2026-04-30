export type AppCategory = 'social' | 'productivity' | 'other';

const SOCIAL_APPS = [
  'com.instagram.android',
  'com.facebook.katana',
  'com.whatsapp',
  'com.snapchat.android',
  'com.twitter.android',
];

const PRODUCTIVITY_APPS = [
  'com.google.android.gm',
  'com.microsoft.office.word',
  'com.microsoft.teams',
  'com.notion.id',
];

export const getAppCategory = (packageName: string): AppCategory => {
  if (SOCIAL_APPS.includes(packageName)) return 'social';
  if (PRODUCTIVITY_APPS.includes(packageName)) return 'productivity';
  return 'other';
};
