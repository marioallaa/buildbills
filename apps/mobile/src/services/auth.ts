/**
 * Authentication Service
 * Handles Firebase authentication operations
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@buildbills/shared-types';

const AUTH_TOKEN_KEY = '@buildbills:auth_token';
const USER_DATA_KEY = '@buildbills:user_data';

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
      const userData = userDoc.data();
      
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: userData?.displayName || firebaseUser.displayName || '',
        createdAt: userData?.createdAt?.toDate() || new Date(),
        updatedAt: userData?.updatedAt?.toDate() || new Date(),
        settings: userData?.settings,
        profile: userData?.profile,
      };
      
      // Cache user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign up with email, password, and name
   */
  static async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase Auth profile
      await firebaseUser.updateProfile({ displayName });
      
      // Create user document in Firestore
      const now = new Date();
      const userData = {
        displayName,
        email,
        createdAt: now,
        updatedAt: now,
        settings: {
          currency: 'USD',
          notifications: true,
          theme: 'light',
          defaultPaymentTerms: 30,
        },
      };
      
      await firestore().collection('users').doc(firebaseUser.uid).set(userData);
      
      const user: User = {
        id: firebaseUser.uid,
        email,
        displayName,
        createdAt: now,
        updatedAt: now,
        settings: userData.settings,
      };
      
      // Cache user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out
   */
  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Get current Firebase user
   */
  static getCurrentFirebaseUser() {
    return auth().currentUser;
  }

  /**
   * Get cached user data
   */
  static async getCachedUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<void> {
    try {
      const firebaseUser = auth().currentUser;
      
      // Update Firebase Auth profile if display name changed
      if (updates.displayName && firebaseUser) {
        await firebaseUser.updateProfile({ displayName: updates.displayName });
      }
      
      // Update Firestore document
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });
      
      // Update cache
      const cachedUser = await this.getCachedUser();
      if (cachedUser) {
        const updatedUser = { ...cachedUser, ...updates, updatedAt: new Date() };
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Get user-friendly error messages
   */
  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
