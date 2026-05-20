import { type UserProfile, type MarriageStatus } from '../types/profile';

const STORAGE_KEY = 'home-fit-onboarding-profile';

interface LegacyUserProfile {
  isMarried?: boolean;
  marriageStatus?: MarriageStatus;
  [key: string]: unknown;
}

function migrateProfile(data: LegacyUserProfile): UserProfile {
  // 기존 isMarried boolean 데이터를 marriageStatus로 마이그레이션
  if ('isMarried' in data && !('marriageStatus' in data)) {
    const { isMarried, ...rest } = data;
    return {
      ...rest,
      marriageStatus: isMarried ? 'married' : 'single',
    } as unknown as UserProfile;
  }
  return data as unknown as UserProfile;
}

export function saveProfileToStorage(profile: UserProfile): void {
  try {
    const serialized = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    console.error('Failed to save profile to localStorage');
  }
}

export function loadProfileFromStorage(): UserProfile | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const parsed = JSON.parse(serialized) as LegacyUserProfile;
    return migrateProfile(parsed);
  } catch {
    console.error('Failed to load profile from localStorage');
    return null;
  }
}

export function hasStoredProfile(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearStoredProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}
