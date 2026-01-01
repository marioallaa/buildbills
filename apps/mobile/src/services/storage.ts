/**
 * Storage Service
 * Handles file uploads to Firebase Storage
 */

import storage from '@react-native-firebase/storage';
import { storageConfig } from '../config/firebase';

export class StorageService {
  /**
   * Upload a receipt image
   */
  static async uploadReceipt(
    userId: string,
    fileUri: string,
    fileName?: string
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const name = fileName || `receipt_${timestamp}.jpg`;
      const path = `users/${userId}/receipts/${name}`;
      
      const reference = storage().ref(path);
      await reference.putFile(fileUri);
      
      const downloadUrl = await reference.getDownloadURL();
      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      throw new Error('Failed to upload receipt image');
    }
  }

  /**
   * Upload an invoice image
   */
  static async uploadInvoice(
    userId: string,
    invoiceId: string,
    fileUri: string,
    fileName?: string
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const name = fileName || `invoice_${timestamp}.jpg`;
      const path = `users/${userId}/invoices/${invoiceId}/${name}`;
      
      const reference = storage().ref(path);
      await reference.putFile(fileUri);
      
      const downloadUrl = await reference.getDownloadURL();
      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading invoice:', error);
      throw new Error('Failed to upload invoice image');
    }
  }

  /**
   * Upload an expense image
   */
  static async uploadExpenseImage(
    userId: string,
    expenseId: string,
    fileUri: string,
    fileName?: string
  ): Promise<string> {
    try {
      const timestamp = Date.now();
      const name = fileName || `expense_${timestamp}.jpg`;
      const path = `users/${userId}/expenses/${expenseId}/${name}`;
      
      const reference = storage().ref(path);
      await reference.putFile(fileUri);
      
      const downloadUrl = await reference.getDownloadURL();
      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading expense image:', error);
      throw new Error('Failed to upload expense image');
    }
  }

  /**
   * Upload profile picture
   */
  static async uploadProfilePicture(
    userId: string,
    fileUri: string
  ): Promise<string> {
    try {
      const path = `users/${userId}/profile/avatar.jpg`;
      
      const reference = storage().ref(path);
      await reference.putFile(fileUri);
      
      const downloadUrl = await reference.getDownloadURL();
      return downloadUrl;
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Failed to upload profile picture');
    }
  }

  /**
   * Delete a file
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const reference = storage().refFromURL(fileUrl);
      await reference.delete();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Validate file size
   */
  static validateFileSize(fileSize: number): boolean {
    return fileSize <= storageConfig.maxFileSize;
  }

  /**
   * Validate file type
   */
  static validateFileType(fileType: string): boolean {
    return storageConfig.allowedImageTypes.includes(fileType);
  }
}
