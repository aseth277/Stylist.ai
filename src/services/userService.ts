
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { OnboardingFormData } from '@/viewmodels/useOnboardingViewModel';

/**
 * Saves the user's onboarding data to Firestore.
 * This acts as part of the Model layer for user data.
 * @param userId The UID of the user.
 * @param data The onboarding form data.
 * @param authEmail The user's authentication email.
 */
export async function saveUserOnboardingData(
  userId: string,
  data: OnboardingFormData,
  authEmail: string | null | undefined
): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required to save onboarding data.');
  }
  const userDocRef = doc(db, 'users', userId);
  await setDoc(
    userDocRef,
    {
      ...data,
      uid: userId,
      authEmail: authEmail,
      onboardingComplete: true,
      profileLastUpdatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
